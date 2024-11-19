import { Module } from '@nestjs/common';
import { HostController } from './host.controller';
import { HostService } from './host.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { APP_FILTER } from '@nestjs/core';
import { GrpcServerExceptionFilter } from 'nestjs-grpc-exceptions';
import { DictionaryController } from './controllers/dictionary.controller';
import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { QuizController } from './controllers/quiz.controller';

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
      {
        name: 'USER_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'user',
          protoPath: join(
            __dirname,
            '../../libs/shared/jrpc/proto/userService/user.proto',
          ),
          url: 'localhost:5003',
        },
      },
      {
        name: 'QUIZ_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'quiz',
          protoPath: join(
            __dirname,
            '../../libs/shared/jrpc/proto/quizService/quiz.proto',
          ),
          url: 'localhost:5004',
        },
      },
    ]),
  ],
  controllers: [
    DictionaryController,
    AuthController,
    UserController,
    QuizController,
  ],
  providers: [HostService],
})
export class HostModule {}
