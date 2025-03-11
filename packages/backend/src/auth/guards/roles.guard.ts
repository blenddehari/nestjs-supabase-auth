import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'

export const ROLES_KEY = 'roles'

export const Roles = (...roles: string[]) => {
	return (target: any, key?: string, descriptor?: any) => {
		Reflect.defineMetadata(ROLES_KEY, roles, descriptor.value)
		return descriptor
	}
}

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(
		context: ExecutionContext
	): boolean | Promise<boolean> | Observable<boolean> {
		const requiredRoles = this.reflector.get<string[]>(
			ROLES_KEY,
			context.getHandler()
		)

		// If no roles are required, allow access
		if (!requiredRoles || requiredRoles.length === 0) {
			return true
		}

		const { user } = context.switchToHttp().getRequest()

		// If no user or no roles, deny access
		if (!user || !user.roles) {
			return false
		}

		// Check if user has any of the required roles
		return requiredRoles.some(role => user.roles.includes(role))
	}
} 