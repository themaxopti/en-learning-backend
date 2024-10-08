import { HttpExceptionFilter } from '@app/shared/interceptors/excepion.interceptor';
import { Body, Catch, Controller, Inject, OnModuleInit, Post, UseFilters } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

interface UserService {
  getUsers: (args: any) => any;
  createUser: (args: any) => any;
  login: (args: any) => any;
  logout: (args: any, metadata?: any) => any;
  auth: (args: any, metadata?: any) => any;
}

@Controller()
export class HostController implements OnModuleInit {
  private userService: UserService;

  constructor(
    @Inject('USER_PACKAGE') private readonly userClient: ClientGrpc
  ) { }

  onModuleInit() {
    this.userService = this.userClient.getService<UserService>('UserService');
  }

  @Post('user/create')
  createUser(@Body() dto): any {
    console.log(this.userService);
    return this.userService.createUser(dto);
  }
}
