import { Controller, Get } from '@nestjs/common';
import { DictionaryService } from './dictionary.service';
import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/users.model';
import { GrpcMethod } from '@nestjs/microservices';

dotenv.config({ path: process.cwd() + '../.env.development' });

@Controller()
export class DictionaryController {
  constructor(
    private readonly dictionaryService: DictionaryService,
    private configService: ConfigService,
    @InjectModel(User) private userRepository: typeof User
  ) { }

  @Get()
  async getHello() {
    console.log('hi2', process.env.DB_HOST, this.configService.get<string>('DB_HOST'));
    const user = await this.userRepository.create({email:'some',password:'any'})
    return this.dictionaryService.getHello();
  }

  @GrpcMethod('DictionaryService', 'GetUsers')
  getUsers() {
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
}
