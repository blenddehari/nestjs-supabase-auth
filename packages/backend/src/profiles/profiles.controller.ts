import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Request } from '@nestjs/common'
import { ProfilesService } from './profiles.service'
import { Profile, Prisma } from '@prisma/client'
import { AuthGuard } from '@nestjs/passport'

@Controller('profiles')
export class ProfilesController {
	constructor(private readonly profilesService: ProfilesService) {}

	@Get()
	async findAll(): Promise<Profile[]> {
		return this.profilesService.findAll()
	}

	@Get(':id')
	async findOne(@Param('id') id: string): Promise<Profile> {
		return this.profilesService.findOne(id)
	}

	@UseGuards(AuthGuard('jwt'))
	@Get('me')
	async findMe(@Request() req): Promise<Profile> {
		return this.profilesService.findByUserId(req.user.id)
	}

	@UseGuards(AuthGuard('jwt'))
	@Post()
	async create(@Body() data: Prisma.ProfileCreateInput): Promise<Profile> {
		return this.profilesService.create(data)
	}

	@UseGuards(AuthGuard('jwt'))
	@Put('me')
	async updateMe(@Request() req, @Body() data: Prisma.ProfileUpdateInput): Promise<Profile> {
		return this.profilesService.updateByUserId(req.user.id, data)
	}

	@UseGuards(AuthGuard('jwt'))
	@Put(':id')
	async update(@Param('id') id: string, @Body() data: Prisma.ProfileUpdateInput): Promise<Profile> {
		return this.profilesService.update(id, data)
	}

	@UseGuards(AuthGuard('jwt'))
	@Delete(':id')
	async remove(@Param('id') id: string): Promise<Profile> {
		return this.profilesService.delete(id)
	}
} 