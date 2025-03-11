import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthGuard } from '@nestjs/passport'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('login')
	async login(@Body() loginDto: { email: string, password: string }) {
		return this.authService.login(loginDto.email, loginDto.password)
	}

	@Post('register')
	async register(@Body() registerDto: { email: string, password: string }) {
		return this.authService.register(registerDto.email, registerDto.password)
	}

	@UseGuards(AuthGuard('jwt'))
	@Get('me')
	getProfile(@Request() req) {
		return req.user
	}
} 