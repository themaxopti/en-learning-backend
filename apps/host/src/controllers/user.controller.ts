import { Body, Controller, Inject, OnModuleInit, Post } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

interface UserService {
  getUsers: (args: any) => any;
  createUser: (args: any) => any;
}

@Controller()
export class UserController implements OnModuleInit {
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
