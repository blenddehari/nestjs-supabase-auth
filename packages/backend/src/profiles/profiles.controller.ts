import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Request, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common'
import { ProfilesService } from './profiles.service'
import { Profile, Prisma } from '@prisma/client'
import { AuthGuard } from '@nestjs/passport'
import { validate as uuidValidate } from 'uuid'

@Controller('profiles')
export class ProfilesController {
	constructor(private readonly profilesService: ProfilesService) {}

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
			console.log('Finding profile for user ID:', userId)
			
			const profile = await this.profilesService.findByUserId(userId)
			if (!profile) {
				throw new NotFoundException(`Profile for current user not found`)
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
} 