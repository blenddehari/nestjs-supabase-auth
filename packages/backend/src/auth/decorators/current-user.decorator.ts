import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { SupabaseAuthUser } from '../../user.type'

export interface CurrentUserType extends SupabaseAuthUser {
	roles: string[]
}

export const CurrentUser = createParamDecorator(
	(data: unknown, ctx: ExecutionContext): CurrentUserType => {
		const request = ctx.switchToHttp().getRequest()
		return request.user
	}
) 