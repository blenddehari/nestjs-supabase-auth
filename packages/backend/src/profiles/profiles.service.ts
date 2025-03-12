import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Profile, Prisma } from '@prisma/client'

@Injectable()
export class ProfilesService {
	constructor(private prisma: PrismaService) {}

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
			// Use Prisma's update method but handle the result
			const profile = await this.prisma.profile.update({
				where: { userId },
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