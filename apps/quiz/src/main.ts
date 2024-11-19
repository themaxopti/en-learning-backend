import { NestFactory } from '@nestjs/core';
import { QuizModule } from './app/quiz.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  // const app = await NestFactory.create(QuizModule);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        url: 'localhost:5004',
        package: 'quiz',
        protoPath: join(
          __dirname,
          '../../libs/shared/jrpc/proto/quizService/quiz.proto',
        ),
      },
    },
  );
  await app.listen();
}
bootstrap();
