import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from '@nestjs/sequelize';
import { DictionaryModule } from "./dictionary/dictionary.module";
import { Dictionary } from "./dictionary/models/dictionary.model";
import { Word } from "./dictionary/models/word.model";
import { DictionaryService } from "./dictionary/dictionary.service";
import { AuthService } from "apps/user/src/user/services/auth.service";
import { UserModule } from "apps/user/src/user/user.module";


@Module({
    // controllers: [AuthController],
    // providers: [AuthService],
    imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: `${process.cwd()}/apps/dictionary/.development.env` }),
        SequelizeModule.forRoot({
            dialect: 'postgres',
            username: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME_DEVELOPMENT,
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            models: [Dictionary, Word],
            autoLoadModels: true
        }),
        DictionaryModule,
        UserModule
    ],
    providers: [
        // ...databaseProviders,
        // DictionaryService,
        // AuthService,
        // Dictionary,
        // Word
    ],


})


export class AppModule { }