import { NestFactory } from '@nestjs/core';
import { DictionaryModule } from './dictionary/dictionary.module';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        url: 'localhost:5002',
        package: 'dictionary',
        protoPath: join(
          __dirname,
          '../../libs/shared/jrpc/proto/dictionaryService/dictionary.proto',
          // '../../../libs/shared/src/jrpc/proto/main.proto',
        ),
      },
    },
  );
  
  await app.listen();
}
bootstrap();
