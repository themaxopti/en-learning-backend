import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { DictionaryService } from './dictionary.service';
import * as dotenv from 'dotenv';
import { GrpcMethod } from '@nestjs/microservices';
import { GrpcCookieInterceptor } from '@app/shared/interceptors/cookie.interceptor';
import {  ChangeWordsIndexDto, CreateDictionaryDto, CreateWordDto, CreateWordsDto, DeleteWordDto, DeleteWordsDto, FindDictionariesDto, FindDictionaryDto, GetWordsDto } from '@app/shared/types/dto/dictionaryService.dto';

dotenv.config({ path: process.cwd() + '../.env.development' });

@Controller()
export class DictionaryController {
  constructor(
    private readonly dictionaryService: DictionaryService,
  ) { }

  @UseInterceptors(GrpcCookieInterceptor)
  @GrpcMethod('DictionaryService', 'GetDictionary')
  async getDictionary(data: FindDictionaryDto, metadata: any) {
    console.log(data.id);

    const userId = metadata.get('userId')[0]
    const response = await this.dictionaryService.findOne({ id: data.id, userId })
    return {
      statusCode: 200,
      data: response
    }
  }

  @UseInterceptors(GrpcCookieInterceptor)
  @GrpcMethod('DictionaryService', 'GetDictionaries')
  async getDictionaries(dto: FindDictionariesDto, metadata: any) {
    const { limit, page } = dto
    const userId = metadata.get('userId')[0]
    const dictionaries = await this.dictionaryService.findMany({ userId, limit, page })

    return {
      statusCode: dictionaries.length > 0 ? 200 : 401,
      data: dictionaries || null
    }
  }

  @UseInterceptors(GrpcCookieInterceptor)
  @GrpcMethod('DictionaryService', 'CreateDictionary')
  async createDictionary(data: CreateDictionaryDto, metadata: any) {
    const userId = metadata.get('userId')[0]
    const response = await this.dictionaryService.createDictionary({ title: data.title, userId }) 
    
    return {
      statusCode: 200,
      data: response
    }
  }

  @UseInterceptors(GrpcCookieInterceptor)
  @GrpcMethod('DictionaryService', 'CreateWord')
  async createWord(data: CreateWordDto, metadata: any) {
    const userId = metadata.get('userId')[0]
    const { dictionaryId, title, translate } = data
    const response = await this.dictionaryService.createWord({ title, dictionaryId, translate }, userId)
    return {
      statusCode: 200,
      data: response
    }
  }

  @UseInterceptors(GrpcCookieInterceptor)
  @GrpcMethod('DictionaryService', 'CreateWords')
  async createWords(dto: CreateWordsDto, metadata: any) {
    const userId = metadata.get('userId')[0]
    const response = await this.dictionaryService.createWords(dto, userId)
    return {
      statusCode: 200,
      data: response
    }
  }

  @UseInterceptors(GrpcCookieInterceptor)
  @GrpcMethod('DictionaryService', 'DeleteWord')
  async deleteWord(dto: DeleteWordDto, metadata: any) {
    const userId = metadata.get('userId')[0]
    const response = await this.dictionaryService.deleteWord(dto, userId)
    return {
      statusCode: 200,
      message: 'Word was deleted'
    }
  }

  @UseInterceptors(GrpcCookieInterceptor)
  @GrpcMethod('DictionaryService', 'DeleteWords')
  async deleteWords(data: DeleteWordsDto, metadata: any) {
    await this.dictionaryService.deleteWords(data)
    return {
      statusCode: 200,
      message: 'Word was deleted'
    }
  }

  @UseInterceptors(GrpcCookieInterceptor)
  @GrpcMethod('DictionaryService', 'GetWords')
  async getWords(data: GetWordsDto) {
    const response = await this.dictionaryService.getWords(data)

    return {
      statusCode: response.length > 0 ? 200 : 401,
      data: response
    }
  }

  @UseInterceptors(GrpcCookieInterceptor)
  @GrpcMethod('DictionaryService', 'ChangeWordsIndex')
  async changeWordsIndex(data: ChangeWordsIndexDto) {
    const response = await this.dictionaryService.changeWordsIndex(data)

    return {
      statusCode: 200,
      data: response
    }
  }
}
