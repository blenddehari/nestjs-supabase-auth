import { Module } from '@nestjs/common'
import { ProfilesService } from './profiles.service'
import { ProfilesController } from './profiles.controller'
import { PrismaModule } from '../prisma/prisma.module'
import { StorageModule } from '../storage/storage.module'

@Module({
	imports: [PrismaModule, StorageModule],
	controllers: [ProfilesController],
	providers: [ProfilesService],
	exports: [ProfilesService]
})
export class ProfilesModule {} 