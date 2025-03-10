import { Controller } from '@nestjs/common'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthResolver {
	constructor(private readonly authService: AuthService) {}

	// Add your REST endpoints here
} 