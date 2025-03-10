import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt } from 'passport-jwt'
import { SupabaseAuthStrategy } from '../passport-supabase.strategy'
import { SupabaseAuthUser } from '../user.type'
import { Request } from 'express'

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

	async validate(payload: SupabaseAuthUser): Promise<SupabaseAuthUser> {
		return super.validate(payload)
	}

	authenticate(req: Request): void {
		super.authenticate(req)
	}
} 