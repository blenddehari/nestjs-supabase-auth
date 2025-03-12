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

		// Log the payload for debugging
		console.log('JWT Payload:', payload)
		console.log('User ID from JWT:', userId)

		if (!userId) {
			throw new UnauthorizedException('Invalid token payload')
		}

		try {
			// Find the user in our database using a simpler query
			const user = await this.prisma.user.findUnique({
				where: { id: userId },
				select: {
					id: true,
					email: true,
					createdAt: true,
					updatedAt: true
				}
			})

			if (!user) {
				console.log(`User with ID ${userId} not found in database`)
				throw new UnauthorizedException('User not found')
			}

			// Return the user object with minimal data
			// The profile can be loaded separately when needed
			return {
				id: user.id,
				email: user.email,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt
			}
		} catch (error) {
			console.error('Error validating JWT token:', error)
			throw new UnauthorizedException('Authentication failed')
		}
	}
} 