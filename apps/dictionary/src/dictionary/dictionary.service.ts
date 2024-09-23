import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Dictionary } from './models/dictionary.model';
import { Word } from './models/word.model';
import { WhereOptions } from 'sequelize';
import { RpcException } from '@nestjs/microservices';
import { RpcStringError, stringError } from '@app/shared/helpers/error.helpers';
import { CreateDictionaryDto, CreateWordDto, CreateWordsDto, DeleteWordDto, DeleteWordsDto, FindDictionariesDto, FindDictionaryDto, GetWordsDto } from '@app/shared/types/dto/dictionaryService.dto';


@Injectable()
export class DictionaryService {
  constructor(
    @InjectModel(Dictionary) private dictionaryRepository: typeof Dictionary,
    @InjectModel(Word) private wordRepository: typeof Word,
  ) {

  }

  async createDictionary(dto: CreateDictionaryDto) {
    const { title, userId } = dto
    const isDictionaryExist = await this.dictionaryRepository.findOne({ where: { title, userId: userId } })
    if (isDictionaryExist) {
      RpcStringError('This dictionary already exist', HttpStatus.FOUND)
    }
    const dictionary = await this.dictionaryRepository.create({ title, userId: userId })
    return dictionary
  }

  async findOne(dto: FindDictionaryDto) {
    const dictionary = await this.dictionaryRepository.findOne({
      where: dto as WhereOptions<FindDictionaryDto>
    })
    if (!dictionary) {
      RpcStringError("This dictionary does not exist", HttpStatus.NOT_FOUND)
      // throw new RpcException(stringError({ msg: 'This dictionary does not exist', statusCode: HttpStatus.NOT_FOUND }))
    }
    return dictionary
  }

  async findMany(dto: FindDictionariesDto) {
    const { limit, page, userId } = dto
    console.log(limit, page);

    const dictionaries = await this.dictionaryRepository.findAll({
      where: { userId },
      limit,
      offset: (page - 1) * limit
    })
    return dictionaries
  }

  async createWord(dto: CreateWordDto, userId: number) {
    const { dictionaryId, title, translate } = dto

    console.log(dto, 'dto');


    await this.findOne({ id: dictionaryId })

    const dictionaryCount = await this.wordRepository.count({
      where: {
        dictionaryId
      }
    })

    console.log(dictionaryCount);


    const allUserWordsCount = await this.wordRepository.count({
      where: {
        userId
      }
    })

    const word = await this.wordRepository.create({
      dictionaryId,
      index: dictionaryCount + 1,
      globalIndex: allUserWordsCount + 1,
      title,
      translate,
      userId
    })

    return {
      id: word.id,
      title: word.title,
      translate: word.translate,
      dictionaryId: word.dictionaryId,
      userId: word.userId,
      index: word.index,
      globalIndex: word.globalIndex
    }
  }

  async getWords(dto: GetWordsDto) {
    const { dictionaryId, limit, page } = dto

    await this.findOne({ id: dictionaryId })

    const words = await this.wordRepository.findAll({
      where: {
        dictionaryId,
      },
      limit,
      offset: (page - 1) * limit
    })

    return words
  }

  async createWords(dto: CreateWordsDto, userId: number) {
    const { dictionaryId, words } = dto
    await this.findOne({ id: dictionaryId })

    let dictionaryCount = await this.wordRepository.count({
      where: {
        dictionaryId
      }
    })
    const allUserWordsCount = await this.wordRepository.count({
      where: {
        userId
      }
    })

    let wordsArr = []

    for (let i = 0; i < words.length; i++) {
      console.log(dictionaryCount);
      const element = words[i];
      const word = await this.wordRepository.create({
        dictionaryId,
        index: dictionaryCount + 1,
        globalIndex: allUserWordsCount + 1,
        title: element.title,
        translate: element.translate,
        userId
      })
      wordsArr.push(word)
      dictionaryCount = dictionaryCount + 1
    }

    return wordsArr
  }

  async deleteWords(dto: DeleteWordsDto) {
    const { dictionaryId, wordsId } = dto

    await this.findOne({ id: dictionaryId })

    for (let i = 0; i < wordsId.length; i++) {
      const id = wordsId[i].id
      await this.wordRepository.destroy({
        where: {
          id,
          dictionaryId
        }
      })
    }

    return {
      message: 'Word was deleted'
    }
  }

  async deleteWord(dto: DeleteWordDto, userId: number) {
    const { dictionaryId, id } = dto

    await this.findOne({ id: dictionaryId })

    await this.wordRepository.destroy({
      where: {
        id,
        dictionaryId
      }
    })

    return {
      message: 'Word was deleted'
    }
  }

}
