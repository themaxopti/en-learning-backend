import { Metadata } from '@grpc/grpc-js';
import { Body, Controller, Get, HttpException, Inject, OnModuleInit, Post, Res, UseFilters } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { objectError, RpcStringError, stringError } from '@app/shared/helpers/error.helpers';
import { Cookies } from '../decorators/cookie.decorator';
import { LoginResponse } from '@app/shared/types/responseTypes/authResTypes';
import { HttpExceptionFilter } from '@app/shared/interceptors/excepion.interceptor';

interface AuthService {
    getUsers: (args: any) => any;
    createUser: (args: any) => any;
    login: (args: any) => any;
    logout: (args: any, metadata?: any) => any;
    auth: (args: any, metadata?: any) => any;
}

@Controller('/api/auth')
@UseFilters(HttpExceptionFilter)
export class AuthController implements OnModuleInit {
    private authService: AuthService;

    constructor(
        @Inject('USER_PACKAGE') private readonly userClient: ClientGrpc
    ) { }

    onModuleInit() {
        this.authService = this.userClient.getService<AuthService>('UserService');
    }

    @Post('/login')
    async loginUser(@Body() dto, @Res() res: Response) {
        try {
            const response: LoginResponse = await firstValueFrom(this.authService.login(dto));
            res.cookie('Authorization', response.data.token, { httpOnly: true, secure: true, sameSite: 'none' });
            return res.json(response)
        } catch (e) {
            console.log(e);
            const error = objectError(e.details)
            throw new HttpException(e.details, error.statusCode)
        }
    }

    @Get()
    async auth(@Body() dto, @Res() res: Response, @Cookies('Authorization') token) {
        try {
            const metadata = new Metadata();
            metadata.add('cookie', `Authorization=${token}`);
            const aswer = await firstValueFrom(this.authService.auth(dto, metadata));
            return res.send(aswer)
        } catch (e) {
            const error = objectError(e.details)
            throw new HttpException(e.details, error.statusCode)
        }
    }

    @Get('/logout')
    async logout(@Body() dto, @Res() res: Response, @Cookies('Authorization') token) {
        try {
            const metadata = new Metadata();
            metadata.add('cookie', `Authorization=${token}`);

            console.log('here');

            if (!token) {
                throw new HttpException(stringError({ msg: 'You are not authenticated in the app', statusCode: 400 }), 400)
                // RpcStringError('sdasdas',400)
            }
            console.log('here');


            const response = await firstValueFrom(this.authService.logout(dto, metadata));
            res.clearCookie('Authorization')
            return res.send(response)
        } catch (e) {
            console.log(typeof e.message);
            const error = objectError(e.details || e.message)
            throw new HttpException(e.details || e.message, error.statusCode)
        }
    }
}
