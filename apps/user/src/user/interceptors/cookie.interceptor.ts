import { Injectable, NestInterceptor, ExecutionContext, CallHandler, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { BaseRpcContext, RpcException } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { AuthService } from '../services/auth.service';

@Injectable()
export class GrpcCookieInterceptor implements NestInterceptor {
    constructor(
        private readonly jwtService: JwtService,
        private authService: AuthService
    ) { }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        // console.log(context);
        const ctx = context.switchToRpc().getContext<Metadata>();
        // console.log(ctx, '======');

        const metadata = ctx.getMap()
        // console.log(metadata.cookie);

        const token = this.extractTokenFromCookie(metadata.cookie as string)

        await this.authService.checkUserToken(token)
        console.log('====0=');

        // const cookie = metadata.get('cookie')[0];
        // if (!cookie) {
        //   throw new RpcException('Missing cookie');
        // }

        // const token = this.extractTokenFromCookie(cookie);
        // try {
        //   const payload = this.jwtService.verify(token);
        //   ctx.getData().user = payload;
        // } catch (err) {
        //   throw new RpcException('Invalid token');
        // }

        return next.handle();
    }

    private extractTokenFromCookie(token: string): string {
        const tokenFromString = token.split('=')[1]
        console.log(tokenFromString);

        if (!tokenFromString) {
            throw new RpcException('Authorization token not found in cookie');
        }
        return tokenFromString;
    }
}
