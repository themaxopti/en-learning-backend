import { NestFactory } from '@nestjs/core';
import { HostModule } from './host.module';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(HostModule);

  const some = 'http://54.91.16.61';

  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      package: 'dictionary',
      protoPath: join(
        __dirname,
        '../../libs/shared/jrpc/proto/dictionaryService/dictionary.proto',
      ), // ['./hero/hero.proto', './hero/hero2.proto']
    },
  });

  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      package: 'user',
      protoPath: join(
        __dirname,
        '../../libs/shared/jrpc/proto/userService/user.proto',
      ), // ['./hero/hero.proto', './hero/hero2.proto']
    },
  });

  app.use(cookieParser());
  // http://localhost:3001
  app.enableCors({
    origin: [
      'http://localhost:3001',
      'http://54.91.16.61',
      'http://localhost:3002',
    ],
    credentials: true,
  });

  await app.listen(3000);
}

bootstrap();
