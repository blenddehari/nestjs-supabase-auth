import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Request, NotFoundException, BadRequestException, InternalServerErrorException, UseInterceptors, UploadedFile } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ProfilesService } from './profiles.service'
import { Profile, Prisma } from '@prisma/client'
import { AuthGuard } from '@nestjs/passport'
import { validate as uuidValidate } from 'uuid'
import { ConfigService } from '@nestjs/config'
import { StorageService } from '../storage/storage.service'

@Controller('profiles')
export class ProfilesController {
	constructor(
		private readonly profilesService: ProfilesService,
		private configService: ConfigService,
		private storageService: StorageService
	) {}

	@Get()
	async findAll(): Promise<Profile[]> {
		try {
			return await this.profilesService.findAll()
		} catch (error) {
			console.error('Error finding all profiles:', error)
			throw new InternalServerErrorException('Failed to retrieve profiles')
		}
	}

	@UseGuards(AuthGuard('jwt'))
	@Get('me')
	async findMe(@Request() req): Promise<Profile> {
		try {
			const userId = req.user.id
			const userEmail = req.user.email
			console.log('Finding profile for user ID:', userId)
			
			let profile = await this.profilesService.findByUserId(userId)
			
			// If profile doesn't exist, create it (fallback for when the trigger doesn't work)
			if (!profile) {
				console.log('Profile not found for user ID:', userId, 'Creating new profile...')
				
				// Check if user exists in the User table
				const prisma = this.profilesService.getPrismaClient()
				let user = await prisma.user.findUnique({
					where: { id: userId }
				})
				
				// If user doesn't exist, create it
				if (!user) {
					console.log('User not found in User table. Creating user record...')
					user = await prisma.user.create({
						data: {
							id: userId,
							email: userEmail
						}
					})
					console.log('User created:', user)
				}
				
				// Create profile directly using raw SQL to avoid JSON serialization issues
				console.log('Creating profile using raw SQL...')
				await prisma.$executeRaw`
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
				
				// Fetch the newly created profile
				profile = await this.profilesService.findByUserId(userId)
				console.log('Profile created successfully:', profile)
			}
			
			// Ensure skills is an array
			if (!Array.isArray(profile.skills)) {
				profile.skills = []
			}
			
			// Ensure experiences is an array
			if (!Array.isArray(profile.experiences)) {
				profile.experiences = []
			}
			
			// Ensure education is an array
			if (!Array.isArray(profile.education)) {
				profile.education = []
			}
			
			return profile
		} catch (error) {
			console.error('Error finding profile for current user:', error)
			if (error instanceof NotFoundException) {
				throw error
			}
			throw new InternalServerErrorException('Failed to retrieve your profile')
		}
	}

	@UseGuards(AuthGuard('jwt'))
	@Get('professionals')
	async findProfessionals(@Request() req): Promise<Profile[]> {
		try {
			const userId = req.user.id
			console.log('Finding all professionals except user ID:', userId)
			
			// Get all profiles except the current user's
			const profiles = await this.profilesService.findAllExceptUser(userId)
			return profiles
		} catch (error) {
			console.error('Error finding professionals:', error)
			throw new InternalServerErrorException('Failed to retrieve professionals')
		}
	}

	@Get(':id')
	async findOne(@Param('id') id: string): Promise<Profile> {
		// Validate UUID format
		if (!uuidValidate(id)) {
			throw new BadRequestException('Invalid profile ID format')
		}
		
		try {
			const profile = await this.profilesService.findOne(id)
			if (!profile) {
				throw new NotFoundException(`Profile with ID ${id} not found`)
			}
			
			// Ensure skills is an array
			if (!Array.isArray(profile.skills)) {
				profile.skills = []
			}
			
			// Ensure experiences is an array
			if (!Array.isArray(profile.experiences)) {
				profile.experiences = []
			}
			
			// Ensure education is an array
			if (!Array.isArray(profile.education)) {
				profile.education = []
			}
			
			return profile
		} catch (error) {
			console.error(`Error finding profile with ID ${id}:`, error)
			if (error instanceof NotFoundException) {
				throw error
			}
			throw new InternalServerErrorException('Failed to retrieve profile')
		}
	}

	@UseGuards(AuthGuard('jwt'))
	@Post()
	async create(@Body() data: Prisma.ProfileCreateInput): Promise<Profile> {
		try {
			// Ensure skills is an array if provided
			if (data.skills && !Array.isArray(data.skills)) {
				data.skills = []
			}
			
			// Ensure experiences is an array if provided
			if (data.experiences && !Array.isArray(data.experiences)) {
				data.experiences = []
			}
			
			// Ensure education is an array if provided
			if (data.education && !Array.isArray(data.education)) {
				data.education = []
			}
			
			const profile = await this.profilesService.create(data)
			return profile
		} catch (error) {
			console.error('Error creating profile:', error)
			throw new InternalServerErrorException('Failed to create profile')
		}
	}

	@UseGuards(AuthGuard('jwt'))
	@Put('me')
	async updateMe(@Request() req, @Body() data: Prisma.ProfileUpdateInput): Promise<Profile> {
		try {
			const userId = req.user.id
			
			// Ensure skills is an array if provided
			if (data.skills && !Array.isArray(data.skills)) {
				data.skills = []
			}
			
			// Ensure experiences is an array if provided
			if (data.experiences && !Array.isArray(data.experiences)) {
				data.experiences = []
			}
			
			// Ensure education is an array if provided
			if (data.education && !Array.isArray(data.education)) {
				data.education = []
			}
			
			// Log the update data for debugging
			console.log('Updating profile for user:', userId)
			console.log('Update data:', {
				...data,
				skills: Array.isArray(data.skills) ? `[${data.skills.length} items]` : data.skills,
				experiences: Array.isArray(data.experiences) ? `[${data.experiences.length} items]` : data.experiences,
				education: Array.isArray(data.education) ? `[${data.education.length} items]` : data.education
			})
			
			const profile = await this.profilesService.updateByUserId(userId, data)
			if (!profile) {
				throw new NotFoundException(`Profile for current user not found`)
			}
			return profile
		} catch (error) {
			console.error('Error updating profile for current user:', error)
			if (error instanceof NotFoundException) {
				throw error
			}
			throw new InternalServerErrorException('Failed to update your profile')
		}
	}

	@UseGuards(AuthGuard('jwt'))
	@Put(':id')
	async update(@Param('id') id: string, @Body() data: Prisma.ProfileUpdateInput): Promise<Profile> {
		// Validate UUID format
		if (!uuidValidate(id)) {
			throw new BadRequestException('Invalid profile ID format')
		}
		
		try {
			// Ensure skills is an array if provided
			if (data.skills && !Array.isArray(data.skills)) {
				data.skills = []
			}
			
			// Ensure experiences is an array if provided
			if (data.experiences && !Array.isArray(data.experiences)) {
				data.experiences = []
			}
			
			// Ensure education is an array if provided
			if (data.education && !Array.isArray(data.education)) {
				data.education = []
			}
			
			const profile = await this.profilesService.update(id, data)
			if (!profile) {
				throw new NotFoundException(`Profile with ID ${id} not found`)
			}
			return profile
		} catch (error) {
			console.error(`Error updating profile with ID ${id}:`, error)
			if (error instanceof NotFoundException) {
				throw error
			}
			throw new InternalServerErrorException('Failed to update profile')
		}
	}

	@UseGuards(AuthGuard('jwt'))
	@Delete(':id')
	async remove(@Param('id') id: string): Promise<Profile> {
		// Validate UUID format
		if (!uuidValidate(id)) {
			throw new BadRequestException('Invalid profile ID format')
		}
		
		try {
			const profile = await this.profilesService.delete(id)
			if (!profile) {
				throw new NotFoundException(`Profile with ID ${id} not found`)
			}
			return profile
		} catch (error) {
			console.error(`Error deleting profile with ID ${id}:`, error)
			if (error instanceof NotFoundException) {
				throw error
			}
			throw new InternalServerErrorException('Failed to delete profile')
		}
	}

	@UseGuards(AuthGuard('jwt'))
	@Post('upload-avatar')
	@UseInterceptors(FileInterceptor('avatar'))
	async uploadAvatar(@Request() req, @UploadedFile() file: Express.Multer.File) {
		try {
			if (!file) {
				throw new BadRequestException('No file uploaded')
			}
			
			// Validate file type
			if (!file.mimetype.match(/^image\/(jpeg|png|gif|webp)$/)) {
				throw new BadRequestException('Invalid file type. Only images are allowed.')
			}
			
			// Validate file size (max 5MB)
			if (file.size > 5 * 1024 * 1024) {
				throw new BadRequestException('File size too large. Maximum size is 5MB.')
			}
			
			const userId = req.user.id
			const fileExt = file.originalname.split('.').pop()
			
			// Generate a unique file path
			const filePath = this.storageService.generateAvatarPath(userId, fileExt)
			
			// Upload to Supabase Storage using S3 client
			console.log(`Uploading avatar for user ${userId} to path ${filePath}`)
			const avatarUrl = await this.storageService.uploadFile(
				filePath,
				file.buffer,
				file.mimetype
			)
			
			console.log(`Avatar uploaded successfully. URL: ${avatarUrl}`)
			
			// Update the user's profile with the new avatar URL
			await this.profilesService.updateByUserId(userId, {
				avatarUrl
			})
			
			return { avatarUrl }
		} catch (error) {
			console.error('Error uploading avatar:', error)
			if (error instanceof BadRequestException) {
				throw error
			}
			throw new InternalServerErrorException('Failed to upload avatar')
		}
	}
} 