import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private configService: ConfigService,
		private prisma: PrismaService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get('SUPABASE_JWT_SECRET')
		})
	}

	async validate(payload: any) {
		// The payload from Supabase JWT contains the user's ID in the 'sub' field
		const userId = payload.sub
		
		// Log the entire payload for debugging
		console.log('JWT Payload:', JSON.stringify(payload, null, 2))
		console.log('User ID from JWT:', userId)
		
		// Extract email from payload - check different possible locations
		let userEmail = null
		if (payload.email) {
			userEmail = payload.email
		} else if (payload.user && payload.user.email) {
			userEmail = payload.user.email
		} else if (payload.user_metadata && payload.user_metadata.email) {
			userEmail = payload.user_metadata.email
		}
		
		console.log('User email from payload:', userEmail)

		if (!userId) {
			throw new UnauthorizedException('Invalid token payload: missing user ID')
		}

		try {
			// Find the user in our database
			let user = await this.prisma.user.findUnique({
				where: { id: userId },
				select: {
					id: true,
					email: true,
					createdAt: true,
					updatedAt: true
				}
			})

			// If user doesn't exist in our database but exists in Supabase Auth,
			// create the user and profile records
			if (!user) {
				console.log(`User with ID ${userId} not found in database. Attempting to create...`)
				
				if (!userEmail) {
					console.error('Cannot create user: email not found in JWT payload')
					throw new UnauthorizedException('Email not found in token payload')
				}
				
				// Create user directly (no transaction)
				try {
					console.log('Creating user with ID:', userId, 'and email:', userEmail)
					user = await this.prisma.user.create({
						data: {
							id: userId,
							email: userEmail
						}
					})
					console.log('User created successfully:', user)
					
					// Now create the profile using raw SQL to avoid JSON serialization issues
					console.log('Creating profile for user ID:', userId)
					await this.prisma.$executeRaw`
						INSERT INTO "Profile" (
							user_id, 
							full_name, 
							headline, 
							bio, 
							location, 
							website, 
							avatar_url, 
							status, 
							skills, 
							experiences, 
							education, 
							created_at, 
							updated_at
						) VALUES (
							${userId}::uuid, 
							'', 
							'', 
							'', 
							'', 
							'', 
							'', 
							'available', 
							'{}'::text[], 
							'[]'::jsonb, 
							'[]'::jsonb, 
							NOW(), 
							NOW()
						)
					`
					console.log('Profile created successfully using raw SQL')
				} catch (error) {
					console.error('Error creating user or profile:', error)
					
					// If it's a unique constraint violation, try to fetch the user again
					if (error.code === 'P2002') {
						console.log('Unique constraint violation. Trying to fetch user again...')
						user = await this.prisma.user.findUnique({
							where: { id: userId },
							select: {
								id: true,
								email: true,
								createdAt: true,
								updatedAt: true
							}
						})
						
						if (user) {
							console.log('User found after retry:', user)
							
							// Check if profile exists
							const profile = await this.prisma.profile.findFirst({
								where: { userId: userId }
							})
							
							if (!profile) {
								console.log('Creating missing profile for existing user...')
								try {
									await this.prisma.$executeRaw`
										INSERT INTO "Profile" (
											user_id, 
											full_name, 
											headline, 
											bio, 
											location, 
											website, 
											avatar_url, 
											status, 
											skills, 
											experiences, 
											education, 
											created_at, 
											updated_at
										) VALUES (
											${userId}::uuid, 
											'', 
											'', 
											'', 
											'', 
											'', 
											'', 
											'available', 
											'{}'::text[], 
											'[]'::jsonb, 
											'[]'::jsonb, 
											NOW(), 
											NOW()
										)
									`
									console.log('Profile created for existing user using raw SQL')
								} catch (profileError) {
									console.error('Error creating profile for existing user:', profileError)
								}
							}
						} else {
							throw new UnauthorizedException('User not found after creation attempt')
						}
					} else {
						throw new UnauthorizedException(`Failed to create user: ${error.message}`)
					}
				}
			}

			if (!user) {
				console.error(`User with ID ${userId} not found and could not be created`)
				throw new UnauthorizedException('User not found and could not be created')
			}

			// Return the user object with minimal data
			return {
				id: user.id,
				email: user.email,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt
			}
		} catch (error) {
			console.error('Error validating JWT token:', error)
			throw error
		}
	}
} 