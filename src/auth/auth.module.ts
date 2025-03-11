import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthResolver } from './auth.resolver'
import { SupabaseStrategy } from './supabase.strategy'
import { PassportModule } from '@nestjs/passport'
import { RolesGuard } from './guards/roles.guard'
import { JwtAuthGuard } from './guards/jwt-auth.guard'

@Module({
	imports: [PassportModule],
	providers: [
		AuthService,
		AuthResolver,
		SupabaseStrategy,
		RolesGuard,
		JwtAuthGuard
	],
	exports: [
		AuthService, 
		SupabaseStrategy,
		RolesGuard,
		JwtAuthGuard
	]
})
export class AuthModule {} 