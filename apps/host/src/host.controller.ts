import { Metadata } from '@grpc/grpc-js';
import { Body, Controller, Get, HttpException, Inject, OnModuleInit, Post, Req, Res, UseFilters, UseInterceptors } from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { Response } from 'express';
import { GrpcToHttpInterceptor } from 'nestjs-grpc-exceptions';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { RpcExceptionCathcer } from './filters/grpcExceptions.filter';
import { objectError } from '@app/shared/helpers/error.helpers';
import { Cookies } from './decorators/cookie.decorator';

interface DictionaryService {
  getUsers: (args: any) => any;
}

interface UserService {
  getUsers: (args: any) => any;
  createUser: (args: any) => any;
  login: (args: any) => any;
  auth: (args: any) => any;
}

@Controller()
export class HostController implements OnModuleInit {
  private dictionaryService: DictionaryService;
  private userService: UserService;

  constructor(
    @Inject('DICTIONARY_PACKAGE') private readonly dictionaryClient: ClientGrpc,
    @Inject('USER_PACKAGE') private readonly userClient: ClientGrpc
  ) { }

  onModuleInit() {
    this.dictionaryService = this.dictionaryClient.getService<DictionaryService>('DictionaryService');
    this.userService = this.userClient.getService<UserService>('UserService');
  }

  @Get()
  getHello(): any {
    return this.userService.getUsers({});
  }

  @Post('user/create')
  createUser(@Body() dto): any {
    console.log(this.userService);
    return this.userService.createUser(dto);
  }

  // @UseFilters(new ExceptionFilter())
  @Post('user/login')
  // @UseFilters(RpcExceptionCathcer)
  async loginUser(@Body() dto, @Res() res: Response) {
    try {
      console.log(dto);

      const response = await firstValueFrom(this.userService.login(dto));

      // @ts-ignore
      res.cookie('Authorization', response.token, { httpOnly: true, path: '/' });

      return res.json(response)
    } catch (e) {
      const error = objectError(e.details)
      throw new HttpException(error.msg, error.statusCode)
    }
  }

  @Get('user/auth')
  async auth(@Body() dto, @Res() res: Response, @Cookies('Authorization') token) {
    try{
      const metadata = new Metadata();
      metadata.add('cookie', `Authorization=${token}`);
      // @ts-ignore
      const aswer = await firstValueFrom(this.userService.auth(dto, metadata));
      return res.send(aswer)
    }catch(e){
      const error = objectError(e.details)
      throw new HttpException(error.msg, error.statusCode)
    }
  }
}
