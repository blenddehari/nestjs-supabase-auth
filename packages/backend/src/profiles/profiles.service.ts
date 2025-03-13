import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Profile, Prisma } from '@prisma/client'

@Injectable()
export class ProfilesService {
	constructor(private prisma: PrismaService) {}

	// Expose the Prisma client for direct access when needed
	getPrismaClient(): PrismaService {
		return this.prisma
	}

	async findAll(): Promise<Profile[]> {
		try {
			// Use raw query to avoid array field issues
			const profiles = await this.prisma.$queryRaw`
				SELECT 
					id, 
					user_id as "userId", 
					full_name as "fullName", 
					headline, 
					bio, 
					location, 
					website, 
					avatar_url as "avatarUrl", 
					status, 
					skills, 
					experiences, 
					education, 
					created_at as "createdAt", 
					updated_at as "updatedAt"
				FROM "Profile"
			`
			
			// Process the results to ensure array fields are arrays
			return this.processProfiles(profiles as Profile[])
		} catch (error) {
			console.error('Error in findAll:', error)
			return []
		}
	}

	async findOne(id: string): Promise<Profile | null> {
		try {
			// Use raw query to avoid array field issues
			const profiles = await this.prisma.$queryRaw`
				SELECT 
					id, 
					user_id as "userId", 
					full_name as "fullName", 
					headline, 
					bio, 
					location, 
					website, 
					avatar_url as "avatarUrl", 
					status, 
					skills, 
					experiences, 
					education, 
					created_at as "createdAt", 
					updated_at as "updatedAt"
				FROM "Profile"
				WHERE id = ${id}::uuid
			`
			
			if (!profiles || (profiles as any[]).length === 0) {
				return null
			}
			
			// Process the results to ensure array fields are arrays
			const processedProfiles = this.processProfiles(profiles as Profile[])
			return processedProfiles[0]
		} catch (error) {
			console.error(`Error in findOne for ID ${id}:`, error)
			return null
		}
	}

	async findByUserId(userId: string): Promise<Profile | null> {
		try {
			// Use raw query to avoid array field issues
			const profiles = await this.prisma.$queryRaw`
				SELECT 
					id, 
					user_id as "userId", 
					full_name as "fullName", 
					headline, 
					bio, 
					location, 
					website, 
					avatar_url as "avatarUrl", 
					status, 
					skills, 
					experiences, 
					education, 
					created_at as "createdAt", 
					updated_at as "updatedAt"
				FROM "Profile"
				WHERE user_id = ${userId}::uuid
			`
			
			if (!profiles || (profiles as any[]).length === 0) {
				return null
			}
			
			// Process the results to ensure array fields are arrays
			const processedProfiles = this.processProfiles(profiles as Profile[])
			return processedProfiles[0]
		} catch (error) {
			console.error(`Error in findByUserId for user ID ${userId}:`, error)
			return null
		}
	}

	async findAllExceptUser(userId: string): Promise<Profile[]> {
		try {
			// Use raw query to avoid array field issues and exclude the current user
			const profiles = await this.prisma.$queryRaw`
				SELECT 
					id, 
					user_id as "userId", 
					full_name as "fullName", 
					headline, 
					bio, 
					location, 
					website, 
					avatar_url as "avatarUrl", 
					status, 
					skills, 
					experiences, 
					education, 
					created_at as "createdAt", 
					updated_at as "updatedAt"
				FROM "Profile"
				WHERE user_id != ${userId}::uuid
				ORDER BY full_name
			`
			
			// Process the results to ensure array fields are arrays
			return this.processProfiles(profiles as Profile[])
		} catch (error) {
			console.error(`Error in findAllExceptUser for user ID ${userId}:`, error)
			return []
		}
	}

	// Helper method to process profiles and ensure array fields are arrays
	private processProfiles(profiles: Profile[]): Profile[] {
		return profiles.map(profile => {
			try {
				// Ensure skills is an array
				if (!Array.isArray(profile.skills)) {
					try {
						profile.skills = profile.skills ? JSON.parse(profile.skills as unknown as string) : []
					} catch (e) {
						console.warn('Error parsing skills:', e)
						profile.skills = []
					}
				}
				
				// Ensure experiences is an array
				if (!Array.isArray(profile.experiences)) {
					try {
						profile.experiences = profile.experiences ? JSON.parse(profile.experiences as unknown as string) : []
					} catch (e) {
						console.warn('Error parsing experiences:', e)
						profile.experiences = []
					}
				}
				
				// Ensure education is an array
				if (!Array.isArray(profile.education)) {
					try {
						profile.education = profile.education ? JSON.parse(profile.education as unknown as string) : []
					} catch (e) {
						console.warn('Error parsing education:', e)
						profile.education = []
					}
				}
				
				return profile
			} catch (error) {
				console.error('Error processing profile:', error)
				// Return a profile with empty arrays for the problematic fields
				return {
					...profile,
					skills: [],
					experiences: [],
					education: []
				}
			}
		})
	}

	async create(data: Prisma.ProfileCreateInput): Promise<Profile> {
		try {
			// Use Prisma's create method but handle the result
			const profile = await this.prisma.profile.create({
				data,
				select: {
					id: true,
					userId: true,
					fullName: true,
					headline: true,
					bio: true,
					location: true,
					website: true,
					avatarUrl: true,
					status: true,
					skills: true,
					experiences: true,
					education: true,
					createdAt: true,
					updatedAt: true
				}
			})
			
			// Process the profile to ensure array fields are arrays
			return this.processProfiles([profile])[0]
		} catch (error) {
			console.error('Error in create:', error)
			throw error
		}
	}

	async update(id: string, data: Prisma.ProfileUpdateInput): Promise<Profile> {
		try {
			// Use Prisma's update method but handle the result
			const profile = await this.prisma.profile.update({
				where: { id },
				data,
				select: {
					id: true,
					userId: true,
					fullName: true,
					headline: true,
					bio: true,
					location: true,
					website: true,
					avatarUrl: true,
					status: true,
					skills: true,
					experiences: true,
					education: true,
					createdAt: true,
					updatedAt: true
				}
			})
			
			// Process the profile to ensure array fields are arrays
			return this.processProfiles([profile])[0]
		} catch (error) {
			console.error(`Error in update for ID ${id}:`, error)
			throw error
		}
	}

	async updateByUserId(userId: string, data: Prisma.ProfileUpdateInput): Promise<Profile> {
		try {
			console.log(`Updating profile for user ID ${userId} with data:`, {
				...data,
				skills: data.skills ? 'Array data (redacted)' : undefined,
				experiences: data.experiences ? 'Array data (redacted)' : undefined,
				education: data.education ? 'Array data (redacted)' : undefined
			})
			
			// For avatar updates, we can use a simpler query that only updates the avatar_url
			if (data.avatarUrl && Object.keys(data).length === 1) {
				console.log(`Performing avatar-only update for user ID ${userId}`)
				
				// Use raw query to update just the avatar URL with proper UUID casting
				await this.prisma.$executeRaw`
					UPDATE "Profile"
					SET avatar_url = ${data.avatarUrl as string}, updated_at = NOW()
					WHERE user_id = ${userId}::uuid
				`
				
				// Fetch the updated profile
				return await this.findByUserId(userId)
			}
			
			// Let's use a different approach - update one field at a time
			// This way we can handle each field's type correctly
			
			// First, get the current profile to make sure it exists
			const currentProfile = await this.findByUserId(userId)
			if (!currentProfile) {
				throw new Error(`Profile not found for user ID ${userId}`)
			}
			
			// Update simple fields first
			if (data.fullName !== undefined || 
				data.headline !== undefined || 
				data.bio !== undefined || 
				data.location !== undefined || 
				data.website !== undefined || 
				data.avatarUrl !== undefined || 
				data.status !== undefined) {
				
				const simpleFields = []
				const simpleParams = []
				let paramIndex = 1
				
				if (data.fullName !== undefined) {
					simpleFields.push(`full_name = $${paramIndex++}`)
					simpleParams.push(data.fullName)
				}
				
				if (data.headline !== undefined) {
					simpleFields.push(`headline = $${paramIndex++}`)
					simpleParams.push(data.headline)
				}
				
				if (data.bio !== undefined) {
					simpleFields.push(`bio = $${paramIndex++}`)
					simpleParams.push(data.bio)
				}
				
				if (data.location !== undefined) {
					simpleFields.push(`location = $${paramIndex++}`)
					simpleParams.push(data.location)
				}
				
				if (data.website !== undefined) {
					simpleFields.push(`website = $${paramIndex++}`)
					simpleParams.push(data.website)
				}
				
				if (data.avatarUrl !== undefined) {
					simpleFields.push(`avatar_url = $${paramIndex++}`)
					simpleParams.push(data.avatarUrl)
				}
				
				if (data.status !== undefined) {
					simpleFields.push(`status = $${paramIndex++}`)
					simpleParams.push(data.status)
				}
				
				// Add updated_at timestamp
				simpleFields.push(`updated_at = NOW()`)
				
				// Add the user_id parameter
				simpleParams.push(userId)
				
				// Build and execute the query for simple fields
				if (simpleFields.length > 0) {
					const simpleQuery = `
						UPDATE "Profile"
						SET ${simpleFields.join(', ')}
						WHERE user_id = $${paramIndex}::uuid
					`
					
					console.log('Executing simple fields query:', simpleQuery)
					console.log('With parameters:', simpleParams)
					
					await this.prisma.$executeRawUnsafe(simpleQuery, ...simpleParams)
				}
			}
			
			// Update skills (text[] type)
			if (data.skills !== undefined) {
				const skillsArray = Array.isArray(data.skills) ? data.skills : []
				await this.prisma.$executeRaw`
					UPDATE "Profile"
					SET skills = ${skillsArray}::text[], updated_at = NOW()
					WHERE user_id = ${userId}::uuid
				`
			}
			
			// Update experiences (jsonb type)
			if (data.experiences !== undefined) {
				const experiencesJson = Array.isArray(data.experiences) 
					? JSON.stringify(data.experiences) 
					: '[]'
				
				await this.prisma.$executeRaw`
					UPDATE "Profile"
					SET experiences = ${experiencesJson}::jsonb, updated_at = NOW()
					WHERE user_id = ${userId}::uuid
				`
			}
			
			// Update education (jsonb type)
			if (data.education !== undefined) {
				const educationJson = Array.isArray(data.education) 
					? JSON.stringify(data.education) 
					: '[]'
				
				await this.prisma.$executeRaw`
					UPDATE "Profile"
					SET education = ${educationJson}::jsonb, updated_at = NOW()
					WHERE user_id = ${userId}::uuid
				`
			}
			
			// Fetch the updated profile
			return await this.findByUserId(userId)
		} catch (error) {
			console.error(`Error in updateByUserId for user ID ${userId}:`, error)
			throw error
		}
	}

	async delete(id: string): Promise<Profile> {
		try {
			// Use Prisma's delete method but handle the result
			const profile = await this.prisma.profile.delete({
				where: { id },
				select: {
					id: true,
					userId: true,
					fullName: true,
					headline: true,
					bio: true,
					location: true,
					website: true,
					avatarUrl: true,
					status: true,
					skills: true,
					experiences: true,
					education: true,
					createdAt: true,
					updatedAt: true
				}
			})
			
			// Process the profile to ensure array fields are arrays
			return this.processProfiles([profile])[0]
		} catch (error) {
			console.error(`Error in delete for ID ${id}:`, error)
			throw error
		}
	}
} 