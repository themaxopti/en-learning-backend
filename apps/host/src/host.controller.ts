import { Controller, Get, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

interface DictionaryService {
  getUsers: (args: any) => any;
}

interface UserService {
  getUsers: (args: any) => any;
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
}
