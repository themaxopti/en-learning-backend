import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './services/user.service';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/users.model';
import { CryptoService } from './services/crypto.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './services/auth.service';
import { TestService } from './services/test.service';


@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: 'secret',
      signOptions: { expiresIn: '60m' },
    }),

  ],
  controllers: [UserController],
  providers: [
    TestService,
    // forwardRef(() => UserService),
    CryptoService,
    AuthService,
    UserService,
    User,
  ],
  exports: [
    UserService,
    TestService,
    CryptoService,
    AuthService,
  ]
})
export class UserModule { }
