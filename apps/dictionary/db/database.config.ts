import * as dotenv from 'dotenv';
import { Sequelize } from 'sequelize-typescript';
import { User } from '../src/dictionary/models/users.model';

export interface IDatabaseConfigAttributes {
    username?: string;
    password?: string;
    database?: string;
    host?: string;
    port?: number | string;
    dialect?: string;
    urlDatabase?: string;
}

export interface IDatabaseConfig {
    development: IDatabaseConfigAttributes;
    test: IDatabaseConfigAttributes;
    production: IDatabaseConfigAttributes;
}


dotenv.config({ path: `${process.cwd()}/apps/dictionary/.development.env` });

export const SEQUELIZE = 'SEQUELIZE';
export const DEVELOPMENT = 'development';
export const TEST = 'test';
export const PRODUCTION = 'production';

export const databaseConfig: IDatabaseConfig = {
    development: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME_DEVELOPMENT,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "postgres",
    },
    test: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME_TEST,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "postgres",
    },
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME_PRODUCTION,
        host: process.env.DB_HOST,
        dialect: "postgres",
    },
};

