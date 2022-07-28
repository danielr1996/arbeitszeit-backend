import {Injectable, CanActivate, ExecutionContext} from '@nestjs/common';
import * as jose from "jose";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly configService: ConfigService) {
    }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization.replace("Bearer ","")
        const JWKS = jose.createRemoteJWKSet(new URL(this.configService.get('JWKS_URL')))
        try{
            await jose.jwtVerify(token, JWKS)
            return true
        }catch(e){
            return false
        }
    }
}
