import {Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus} from '@nestjs/common';
import * as jose from "jose";
import {ConfigService} from "@nestjs/config";
import {Reflector} from '@nestjs/core';
import {SetMetadata} from '@nestjs/common';
import {UsersService} from "../user/user.service";


export enum Role {
    User = 'user',
    Admin = 'admin',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly userService: UsersService,
        private readonly configService: ConfigService,
        private reflector: Reflector,
    ) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        let token = request.headers.authorization
        if (!token) {
            throw new HttpException('No Token provided', HttpStatus.UNAUTHORIZED)
        }
        token = token.replace("Bearer ", "")
        const JWKS = jose.createRemoteJWKSet(new URL(this.configService.get('JWKS_URL')))
        try {
            const {payload} = await jose.jwtVerify(token, JWKS)
            const roles = payload["realm_access"]["roles"]
            const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
                context.getHandler(),
                context.getClass(),
            ]);
            if (requiredRoles && !requiredRoles.some((role) => roles.includes(role))) {
                console.log('Unauthorized, Roles mismatch, required roles: ',requiredRoles)
                return false
            }
            const user = {id: payload['sub']}
            if(!await this.userService.getUser(user.id)){
                await this.userService.addUser(user)
            }
            request.userId=user.id
            return true
        } catch (e) {
            console.log(e)
            throw new HttpException('Token provided, but verification failed', HttpStatus.UNAUTHORIZED)
        }
    }
}
