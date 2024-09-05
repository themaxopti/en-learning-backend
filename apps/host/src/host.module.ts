import { Module } from '@nestjs/common';
import { HostController } from './host.controller';
import { HostService } from './host.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { APP_FILTER } from '@nestjs/core';
import { GrpcServerExceptionFilter } from "nestjs-grpc-exceptions";

@Module({
  imports: [
    ClientsModule.register([

      {
        name: 'DICTIONARY_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'dictionary',
          protoPath: join(__dirname, '../../libs/shared/jrpc/proto/dictionaryService/dictionary.proto'),
        },
      },
      {
        name: 'USER_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'user',
          protoPath: join(__dirname, '../../libs/shared/jrpc/proto/userService/user.proto'),
          url: "localhost:5003"
        },
      },
    ]),
  ],
  controllers: [HostController],
  providers: [
    HostService,
  ],
})
export class HostModule { }
