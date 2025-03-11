import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Profile, Prisma } from '@prisma/client'

@Injectable()
export class ProfilesService {
	constructor(private prisma: PrismaService) {}

	async findAll(): Promise<Profile[]> {
		return this.prisma.profile.findMany({
			include: {
				user: {
					select: {
						email: true
					}
				}
			}
		})
	}

	async findOne(id: string): Promise<Profile | null> {
		return this.prisma.profile.findUnique({
			where: { id },
			include: {
				user: {
					select: {
						email: true
					}
				}
			}
		})
	}

	async findByUserId(userId: string): Promise<Profile | null> {
		return this.prisma.profile.findUnique({
			where: { userId },
			include: {
				user: {
					select: {
						email: true
					}
				}
			}
		})
	}

	async create(data: Prisma.ProfileCreateInput): Promise<Profile> {
		return this.prisma.profile.create({
			data,
			include: {
				user: {
					select: {
						email: true
					}
				}
			}
		})
	}

	async update(id: string, data: Prisma.ProfileUpdateInput): Promise<Profile> {
		return this.prisma.profile.update({
			where: { id },
			data,
			include: {
				user: {
					select: {
						email: true
					}
				}
			}
		})
	}

	async updateByUserId(userId: string, data: Prisma.ProfileUpdateInput): Promise<Profile> {
		return this.prisma.profile.update({
			where: { userId },
			data,
			include: {
				user: {
					select: {
						email: true
					}
				}
			}
		})
	}

	async delete(id: string): Promise<Profile> {
		return this.prisma.profile.delete({
			where: { id }
		})
	}
} 