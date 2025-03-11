import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt } from 'passport-jwt'
import { SupabaseAuthStrategy } from '../passport-supabase.strategy'
import { SupabaseAuthUser } from '../user.type'
import { Request } from 'express'
import supabase from '../../supabase'

@Injectable()
export class SupabaseStrategy extends PassportStrategy(
	SupabaseAuthStrategy,
	'supabase'
) {
	public constructor() {
		super({
			supabaseUrl: process.env.SUPABASE_URL,
			supabaseKey: process.env.SUPABASE_KEY,
			supabaseOptions: {},
			extractor: ExtractJwt.fromAuthHeaderAsBearerToken()
		})
	}

	async validate(payload: SupabaseAuthUser): Promise<SupabaseAuthUser & { roles: string[] }> {
		// If no payload, authentication failed
		if (!payload) {
			throw new UnauthorizedException('Invalid token')
		}

		// Check if user email is confirmed
		// Note: email_confirmed_at might not be directly accessible, 
		// so we're checking if the user has confirmed their email through the email property
		if (!payload.email) {
			throw new UnauthorizedException('Email not confirmed or missing')
		}

		// Fetch user roles from a custom table (if you have one)
		// This is a simplified example - in a real app, you'd need to create this table
		const { data: userRoles, error } = await supabase
			.from('user_roles')
			.select('role')
			.eq('user_id', payload.id)

		// Enrich the user object with roles
		// If there's an error or no roles found, default to an empty array
		const roles = error || !userRoles ? [] : userRoles.map(ur => ur.role)

		// Return the enriched user object
		return {
			...payload,
			roles
		}
	}

	authenticate(req: Request): void {
		// You can add custom logic here before calling the parent authenticate
		// For example, logging authentication attempts
		console.log(`Authentication attempt from IP: ${req.ip}`)
		
		super.authenticate(req)
	}
} 