import { Controller, Post, Body, Get, UseGuards, Req, Put, BadRequestException, Query, Param } from '@nestjs/common'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { RolesGuard, Roles } from './guards/roles.guard'
import { Request } from 'express'
import { SupabaseAuthUser } from '../user.type'
import { CurrentUser, CurrentUserType } from './decorators/current-user.decorator'

// DTOs
class SignUpDto {
	email: string
	password: string
	name?: string
}

class SignInDto {
	email: string
	password: string
}

class ResetPasswordDto {
	email: string
}

class UpdatePasswordDto {
	password: string
}

class UpdateProfileDto {
	name?: string
	avatar_url?: string
	bio?: string
}

// Social auth providers
type Provider = 'google' | 'github' | 'facebook' | 'twitter'

// Extend the Express Request interface to include the user property
interface RequestWithUser extends Request {
	user: SupabaseAuthUser & { roles: string[] }
}

@Controller('auth')
export class AuthResolver {
	constructor(private readonly authService: AuthService) {}

	@Post('signup')
	async signup(@Body() signUpDto: SignUpDto) {
		return this.authService.signUp(signUpDto)
	}

	@Post('signin')
	async signin(@Body() signInDto: SignInDto) {
		return this.authService.signIn(signInDto)
	}

	@Post('signout')
	@UseGuards(JwtAuthGuard)
	async signout(@Req() req: Request) {
		const token = this.extractTokenFromHeader(req)
		return this.authService.signOut(token)
	}

	@Post('reset-password')
	async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
		return this.authService.resetPassword(resetPasswordDto)
	}

	@Put('update-password')
	@UseGuards(JwtAuthGuard)
	async updatePassword(
		@Body() updatePasswordDto: UpdatePasswordDto,
		@Req() req: Request
	) {
		const token = this.extractTokenFromHeader(req)
		return this.authService.updatePassword(updatePasswordDto, token)
	}

	@Get('profile')
	@UseGuards(JwtAuthGuard)
	async getProfile(@CurrentUser() user: CurrentUserType) {
		return this.authService.getProfile(user.id)
	}

	@Put('profile')
	@UseGuards(JwtAuthGuard)
	async updateProfile(
		@Body() _updateProfileDto: UpdateProfileDto,
		@CurrentUser() user: CurrentUserType
	) {
		// This would need to be implemented in the AuthService
		// For now, just acknowledge we received the user ID
		return {
			message: `Profile update requested for user ${user.id}`,
			status: 'not_implemented'
		}
	}

	@Get('admin-dashboard')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles('admin')
	async adminDashboard(@CurrentUser() user: CurrentUserType) {
		return {
			message: `Welcome to the admin dashboard, ${user.email}!`
		}
	}

	// Social authentication endpoints
	@Get('social/:provider')
	async getSocialAuthUrl(@Param('provider') provider: Provider) {
		return this.authService.getSocialAuthUrl(provider)
	}

	@Get('social/callback')
	async handleSocialAuthCallback(@Query('code') code: string) {
		return this.authService.handleSocialAuthCallback(code)
	}

	@Post('social/link/:provider')
	@UseGuards(JwtAuthGuard)
	async linkSocialAccount(
		@Param('provider') provider: Provider,
		@Req() req: Request
	) {
		const token = this.extractTokenFromHeader(req)
		return this.authService.linkSocialAccount(provider, token)
	}

	private extractTokenFromHeader(req: Request): string {
		const authHeader = req.headers.authorization
		if (!authHeader) {
			throw new BadRequestException('Authorization header not found')
		}
		
		const [type, token] = authHeader.split(' ')
		if (type !== 'Bearer') {
			throw new BadRequestException('Invalid token type')
		}
		
		return token
	}
} 