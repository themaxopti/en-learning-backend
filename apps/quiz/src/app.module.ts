import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { QuizModule } from './app/quiz.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  // controllers: [AuthController],
  // providers: [AuthService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.cwd()}/apps/quiz/.development.env`,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME_DEVELOPMENT,
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      models: [],
      autoLoadModels: true,
    }),
    QuizModule,
  ],
  providers: [
    // ...databaseProviders,
  ],
})
export class AppModule {}
