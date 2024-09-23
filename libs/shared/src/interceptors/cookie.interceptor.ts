import { Injectable, NestInterceptor, ExecutionContext, CallHandler, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { BaseRpcContext, RpcException } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
// import { AuthService } from '../services/auth.service';
import { stringError } from '@app/shared/helpers/error.helpers';
import { AuthService } from 'apps/user/src/user/services/auth.service';

@Injectable()
export class GrpcCookieInterceptor implements NestInterceptor {
    constructor(
        private readonly jwtService: JwtService,
        private authService: AuthService
    ) { }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const ctx = context.switchToRpc().getContext<Metadata>();

        const metadata = ctx.getMap()

        const token = this.extractTokenFromCookie(metadata.cookie as string)

        const userId = await this.authService.checkUserToken(token)
        ctx.add('userId', String(userId))

        return next.handle();
    }

    private checkUserToken(token:string){

    }

    private extractTokenFromCookie(token: string): string {
        const tokenFromString = token.split('=')[1]
        console.log(typeof tokenFromString,'hi');

        if (!tokenFromString || tokenFromString === 'undefined') {
            throw new RpcException(stringError({ msg: 'Authorization token is not found in cookie', statusCode: 401 }));
        }
        return tokenFromString;
    }
}
