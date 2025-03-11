import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private configService: ConfigService,
		private prisma: PrismaService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get('SUPABASE_JWT_SECRET')
		})
	}

	async validate(payload: any) {
		// The payload contains the user's ID from Supabase
		const { sub } = payload

		// Find the user in our database
		const user = await this.prisma.user.findUnique({
			where: { id: sub },
			include: { profile: true }
		})

		if (!user) {
			throw new UnauthorizedException('User not found')
		}

		// Return the user object, which will be added to the request object
		return user
	}
} 