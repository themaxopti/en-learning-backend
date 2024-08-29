import { Module } from '@nestjs/common';
import { DictionaryController } from './user.controller';
import { DictionaryService } from './user.service';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/users.model';


@Module({
  imports: [
    SequelizeModule.forFeature([User]),
  ],
  controllers: [DictionaryController],
  providers: [
    DictionaryService,
    User
  ],
  exports: [
  ]
})
export class DictionaryModule { }
