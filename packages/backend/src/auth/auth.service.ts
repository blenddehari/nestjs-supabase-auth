import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common'
import supabase from '../supabase'

// Define interfaces for our DTOs
interface SignUpDto {
	email: string
	password: string
	name?: string
}

interface SignInDto {
	email: string
	password: string
}

interface ResetPasswordDto {
	email: string
}

interface UpdatePasswordDto {
	password: string
}

// Social auth providers
type Provider = 'google' | 'github' | 'facebook' | 'twitter'

@Injectable()
export class AuthService {
	constructor() {}

	/**
	 * Register a new user
	 */
	async signUp(signUpDto: SignUpDto) {
		const { email, password, name } = signUpDto

		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					name
				}
			}
		})

		if (error) {
			throw new BadRequestException(error.message)
		}

		return {
			message: 'Registration successful. Please check your email for verification.',
			user: data.user
		}
	}

	/**
	 * Sign in a user
	 */
	async signIn(signInDto: SignInDto) {
		const { email, password } = signInDto

		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password
		})

		if (error) {
			throw new UnauthorizedException('Invalid credentials')
		}

		return {
			user: data.user,
			session: data.session
		}
	}

	/**
	 * Sign out a user
	 */
	async signOut(token: string) {
		const { error } = await supabase.auth.admin.signOut(token)

		if (error) {
			throw new BadRequestException(error.message)
		}

		return {
			message: 'Successfully signed out'
		}
	}

	/**
	 * Request password reset
	 */
	async resetPassword(resetPasswordDto: ResetPasswordDto) {
		const { email } = resetPasswordDto

		const { error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: process.env.PASSWORD_RESET_REDIRECT_URL
		})

		if (error) {
			throw new BadRequestException(error.message)
		}

		return {
			message: 'Password reset instructions sent to your email'
		}
	}

	/**
	 * Update user password
	 */
	async updatePassword(updatePasswordDto: UpdatePasswordDto, token: string) {
		const { password } = updatePasswordDto

		// Set auth header for this request
		supabase.auth.setSession({
			access_token: token,
			refresh_token: ''
		})

		const { error } = await supabase.auth.updateUser({
			password
		})

		if (error) {
			throw new BadRequestException(error.message)
		}

		return {
			message: 'Password updated successfully'
		}
	}

	/**
	 * Get user profile
	 */
	async getProfile(userId: string) {
		const { data, error } = await supabase
			.from('profiles')
			.select('*')
			.eq('id', userId)
			.single()

		if (error) {
			throw new BadRequestException(error.message)
		}

		return data
	}

	/**
	 * Get social auth URL
	 */
	async getSocialAuthUrl(provider: Provider) {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider,
			options: {
				redirectTo: process.env.OAUTH_REDIRECT_URL
			}
		})

		if (error) {
			throw new BadRequestException(error.message)
		}

		return {
			url: data.url
		}
	}

	/**
	 * Handle social auth callback
	 */
	async handleSocialAuthCallback(code: string) {
		const { data, error } = await supabase.auth.exchangeCodeForSession(code)

		if (error) {
			throw new BadRequestException(error.message)
		}

		return {
			user: data.user,
			session: data.session
		}
	}

	/**
	 * Link social account to existing user
	 */
	async linkSocialAccount(_provider: Provider, token: string) {
		// Set auth header for this request
		supabase.auth.setSession({
			access_token: token,
			refresh_token: ''
		})

		// This is a simplified version - in reality, you'd need to handle the OAuth flow
		// and then call the Supabase API to link the account
		return {
			message: 'Social account linking is not implemented in this example',
			status: 'not_implemented'
		}
	}
} 