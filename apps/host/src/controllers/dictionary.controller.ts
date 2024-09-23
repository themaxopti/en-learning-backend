import { Metadata } from '@grpc/grpc-js';
import { Body, Controller, Delete, Get, HttpException, Inject, OnModuleInit, Param, Post, Res, UseFilters } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { objectError } from '@app/shared/helpers/error.helpers';
import { Cookies } from '../decorators/cookie.decorator';
import { CreateWordDto, CreateWordsDto, DeleteWordDto, DeleteWordsDto, GetWordsDto } from '@app/shared/types/dto/dictionaryService.dto';
import { HttpExceptionFilter } from '@app/shared/interceptors/excepion.interceptor';

interface DictionaryService {
    getDictionary: (args: any, metadata: any) => any;
    getDictionaries: (args: any, metadata: any) => any;
    createDictionary: (args: any, metadata: any) => any;
    createWord: (args: CreateWordDto, metadata: any) => any;
    createWords: (args: CreateWordsDto, metadata: any) => any;
    getWords: (args: GetWordsDto, metadata: any) => any;
    deleteWord: (args: DeleteWordDto, metadata: any) => any;
    deleteWords: (args: DeleteWordsDto, metadata: any) => any;
}

@Controller('dictionary')
@UseFilters(HttpExceptionFilter)
export class DictionaryController implements OnModuleInit {
    private dictionaryService: DictionaryService;

    constructor(
        @Inject('DICTIONARY_PACKAGE') private readonly dictionaryClient: ClientGrpc,
    ) { }

    onModuleInit() {
        this.dictionaryService = this.dictionaryClient.getService<DictionaryService>('DictionaryService');
    }

    @Post('/create')
    async createDictionary(@Body() dto, @Res() res: Response, @Cookies('Authorization') token) {
        try {
            const metadata = new Metadata();
            metadata.add('cookie', `Authorization=${token}`);

            const response = await firstValueFrom(this.dictionaryService.createDictionary(dto, metadata));
            return res.send(response)
        } catch (e) {
            console.log(e);
            const error = objectError(e.details)
            throw new HttpException(e.details, error.statusCode)
        }
    }

    @Get('/:id')
    async findDictionary(@Param() { id }, @Res() res: Response, @Cookies('Authorization') token) {
        try {
            const metadata = new Metadata();
            metadata.add('cookie', `Authorization=${token}`);
            const response = await firstValueFrom(this.dictionaryService.getDictionary({ id }, metadata));
            return res.send(response)
        } catch (e) {
            console.log('1------');
            console.log(e.details);
            const error = objectError(e.details)
            throw new HttpException(e.details, error.statusCode)
        }
    }

    @Get('/many/:page/:limit')
    async findDictionaries(@Param() { page, limit }, @Res() res: Response, @Cookies('Authorization') token) {
        try {
            const metadata = new Metadata();
            metadata.add('cookie', `Authorization=${token}`);
            const response = await firstValueFrom(this.dictionaryService.getDictionaries({ page, limit }, metadata));
            return res.send(response)
        } catch (e) {
            console.log(e);
            const error = objectError(e.details)
            throw new HttpException(e.details, error.statusCode)
        }
    }

    @Get('/words/:dictionaryId/:limit/:page')
    async getWords(@Param() { dictionaryId, page, limit }, @Res() res: Response, @Cookies('Authorization') token) {
        try {
            const metadata = new Metadata();
            metadata.add('cookie', `Authorization=${token}`);

            const response = await firstValueFrom(this.dictionaryService.getWords({ dictionaryId, page, limit }, metadata));
            return res.send(response)
        } catch (e) {
            const error = objectError(e.details)
            throw new HttpException(e.details, error.statusCode)
        }
    }

    @Post('/word')
    async createWord(@Body() dto, @Res() res: Response, @Cookies('Authorization') token) {
        try {
            const metadata = new Metadata();
            metadata.add('cookie', `Authorization=${token}`);

            console.log(dto,'dto');
            

            const response = await firstValueFrom(this.dictionaryService.createWord(dto, metadata));
            return res.send(response)
        } catch (e) {
            console.log(e);
            const error = objectError(e.details)
            throw new HttpException(e.details, error.statusCode)
        }
    }

    @Post('/words')
    async createWords(@Body() dto, @Res() res: Response, @Cookies('Authorization') token) {
        try {
            const metadata = new Metadata();
            metadata.add('cookie', `Authorization=${token}`);

            const response = await firstValueFrom(this.dictionaryService.createWords(dto, metadata));
            return res.send(response)
        } catch (e) {
            console.log(e);
            const error = objectError(e.details)
            throw new HttpException(e.details, error.statusCode)
        }
    }

    @Delete('/word')
    async deleteWord(@Body() dto, @Res() res: Response, @Cookies('Authorization') token) {
        try {
            const metadata = new Metadata();
            metadata.add('cookie', `Authorization=${token}`);

            const response = await firstValueFrom(this.dictionaryService.deleteWord(dto, metadata));
            return res.send(response)
        } catch (e) {
            console.log(e);
            const error = objectError(e.details)
            throw new HttpException(e.details, error.statusCode)
        }
    }

    @Delete('/words')
    async deleteWords(@Body() dto, @Res() res: Response, @Cookies('Authorization') token) {
        try {
            const metadata = new Metadata();
            metadata.add('cookie', `Authorization=${token}`);

            const response = await firstValueFrom(this.dictionaryService.deleteWords(dto, metadata));
            return res.send(response)
        } catch (e) {
            console.log(e);
            const error = objectError(e.details)
            throw new HttpException(e.details, error.statusCode)
        }
    }

}
