import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { UserService } from './services/user.service';
import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/users.model';
import { GrpcMethod } from '@nestjs/microservices';
import { objectError, RpcStringError } from '@app/shared/helpers/error.helpers';
// import { GrpcCookieInterceptor } from './interceptors/cookie.interceptor';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { AuthService } from './services/auth.service';
import { GrpcCookieInterceptor } from '@app/shared/interceptors/cookie.interceptor';
import { CreateUserDto, LoginDto } from '@app/shared/types/dto/userService.dto';

dotenv.config({ path: process.cwd() + '../.env.development' });

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private configService: ConfigService,
    private authService: AuthService,
    @InjectModel(User) private userRepository: typeof User
  ) { }


  @GrpcMethod('UserService', 'GetUsers')
  getUsers() {
    // return this.userService.create
    // sayHi();
    return {
      users: [
        {
          id: 1,
          name: 'John',
        },
        {
          id: 2,
          name: 'Roger22',
        },
      ],
    };
  }

  @GrpcMethod('UserService', 'CreateUser')
  async createUser(data: CreateUserDto) {
    try {
      await this.userService.create(data)
      return {
        msg: 'User was successufuly added',
        statusCode: 200,
      };
    } catch (e) {
      console.log(e.message);
      const error = objectError(e.message)
      if (error)
        return {
          msg: error.msg,
          statusCode: error.statusCode,
        };
      else {
        return {
          msg: 'Some error happend',
          statusCode: 404
        }
      }
    }
  }

  @UseInterceptors(GrpcCookieInterceptor)
  @GrpcMethod('UserService', 'Auth')
  async auth(data: CreateUserDto, metadata: any, call: any) {
    const userId = metadata.get('userId')[0]
    return this.authService.auth(userId)
  }

  // @UseInterceptors(GrpcCookieInterceptor)
  @GrpcMethod('UserService', 'Login')
  async login(data: LoginDto, metadata: any, call: ServerUnaryCall<any, any>) {
    console.log(data);
    return this.authService.login(data);
  }

  @UseInterceptors(GrpcCookieInterceptor)
  @GrpcMethod('UserService', 'Logout')
  async logout(data, metadata: Metadata) {
    const userId = metadata.get('userId')[0]
   
    return this.authService.deleteUserToken(userId);
  }
}
