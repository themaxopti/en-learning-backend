import { NestFactory } from '@nestjs/core';
import { DictionaryModule } from './user/user.module';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  // console.log(process.env.DB_HOST);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        // url: 'localhost:5003',
        package: 'user',
        protoPath: join(
          __dirname,
          '../../libs/shared/jrpc/proto/userService/user.proto',
          // '../../../libs/shared/src/jrpc/proto/main.proto',
        ),
      },
    },
  );

  await app.listen();
}
bootstrap();
