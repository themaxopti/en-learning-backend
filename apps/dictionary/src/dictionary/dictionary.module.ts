import { Module } from '@nestjs/common';
import { DictionaryController } from './dictionary.controller';
import { DictionaryService } from './dictionary.service';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { SequelizeModule } from '@nestjs/sequelize';
import { Dictionary } from './models/dictionary.model';
import { Word } from './models/word.model';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from 'apps/user/src/user/services/auth.service';
import { UserService } from 'apps/user/src/user/services/user.service';
import { CryptoService } from 'apps/user/src/user/services/crypto.service';
import { User } from 'apps/user/src/user/models/users.model';


@Module({
  imports: [
    SequelizeModule.forFeature([Dictionary,Word,User]),
    JwtModule.register({
      global: true,
      secret: 'secret',
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [DictionaryController],
  providers: [
    AuthService,
    UserService,
    CryptoService,
    DictionaryService,
    Dictionary,
    // Word,
    // User
  ],
  exports: [
  ]
})
export class DictionaryModule { }
