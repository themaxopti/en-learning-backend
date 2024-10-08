import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from "./user/user.module";
import { User } from "./user/models/users.model";


@Module({
    // controllers: [AuthController],
    // providers: [AuthService],
    imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: `${process.cwd()}/apps/user/.development.env` }),
        SequelizeModule.forRoot({
            dialect: 'postgres',
            username: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME_DEVELOPMENT,
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            models: [User],
            autoLoadModels: true
        }),
        UserModule,
    ],
    providers: [
        // ...databaseProviders,
    ],


})

export class AppModule { }