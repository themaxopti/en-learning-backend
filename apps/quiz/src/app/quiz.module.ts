import { Module } from '@nestjs/common';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { CryptoService } from 'apps/user/src/user/services/crypto.service';
import { AuthService } from 'apps/user/src/user/services/auth.service';
import { UserService } from 'apps/user/src/user/services/user.service';
import { User } from 'apps/user/src/user/models/users.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { QuizModel } from './models/Quiz.model';
import { QuizzesDictionariesModel } from './models/QuizzesDictionaries';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'DICTIONARY_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'dictionary',
          protoPath: join(
            __dirname,
            '../../libs/shared/jrpc/proto/dictionaryService/dictionary.proto',
          ),
          url: 'localhost:5002',
        },
      },
    ]),
    SequelizeModule.forFeature([User,QuizModel,QuizzesDictionariesModel]),
    JwtModule.register({
      global: true,
      secret: 'secret',
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [
    // TestService,
    // forwardRef(() => UserService),
    CryptoService,
    AuthService,
    UserService,
    User,
    QuizService
  ],
  exports: [
    UserService,
    CryptoService,
    AuthService,
  ],
  controllers: [QuizController],
})
export class QuizModule {}
