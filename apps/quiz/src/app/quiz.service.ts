import {
  CreateQuizDto,
  GetQuizDto,
  GetQuizzesDto,
} from '@app/shared/types/dto/quizService.dto';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QuizzesDictionariesModel } from './models/QuizzesDictionaries';
import { QuizModel } from './models/Quiz.model';
import { User } from 'apps/user/src/user/models/users.model';
import { objectError, RpcStringError } from '@app/shared/helpers/error.helpers';
import { ClientGrpc } from '@nestjs/microservices';
import { DictionaryService } from 'apps/host/src/controllers/dictionary.controller';
import { firstValueFrom } from 'rxjs';
import { Metadata } from '@grpc/grpc-js';
import { GetDictionaryWordsResType } from '@app/shared/types/responseTypes/dictionaryServiceResTypes';

@Injectable()
export class QuizService {
  private dictionaryService: DictionaryService;

  constructor(
    @InjectModel(QuizzesDictionariesModel)
    private quizzesDictionariesRepo: typeof QuizzesDictionariesModel,
    @InjectModel(QuizModel) private quizRepo: typeof QuizModel,
    @InjectModel(User)
    private userRepo: typeof User,
    @Inject('DICTIONARY_PACKAGE') private readonly dictionaryClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.dictionaryService =
      this.dictionaryClient.getService<DictionaryService>('DictionaryService');
  }

  async find(dto: GetQuizDto, metadata: any) {
    const quiz = await this.quizRepo.findOne({ where: dto as any });
    if (!quiz) {
      RpcStringError('This quiz does not exist', HttpStatus.NOT_FOUND);
    }
    // console.log(dto);

    const dictionariesByQuiz = await this.quizzesDictionariesRepo.findAll({
      where: { quizId: dto.id },
    });
    const words: GetDictionaryWordsResType['data'] = [];

    for (let i = 0; i < dictionariesByQuiz.length; i++) {
      const dictionaryAndQuiz = dictionariesByQuiz[i];

      const dictWords = await firstValueFrom(
        this.dictionaryService.getWords(
          {
            dictionaryId: dictionaryAndQuiz.dictionaryId,
            limit: 10000,
            page: 1,
          },
          metadata,
        ),
      );
      words.push(...dictWords.data);
    }

    const editedWords = this.makeWordsForQuiz(words);
    console.log(editedWords);
    
    return {
      id: quiz.id,
      title: quiz.title,
      words:editedWords,
    };
  }

  async findMany({ limit, offset, userId }: GetQuizzesDto) {
    const user = this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      RpcStringError('This user does not exist', HttpStatus.NOT_FOUND);
    }

    const dictionaries = await this.quizRepo.findAll({
      limit,
      offset,
      where: {
        userId,
      },
    });
    return dictionaries;
  }

  async create(dto: CreateQuizDto, metadata: any) {
    const { dictionaries, title, userId } = dto;
    const quiz = await this.quizRepo.create({ title: dto.title, userId });
    for (let i = 0; i < dictionaries.length; i++) {
      try {
        const dictionaryId = dictionaries[i];
        const isDictionaryExist = await firstValueFrom(
          this.dictionaryService.getDictionary({ id: dictionaryId }, metadata),
        );
        if (isDictionaryExist) {
          await this.quizzesDictionariesRepo.create({
            dictionaryId,
            quizId: quiz.id,
          });
        }
      } catch (e) {
        const objError = objectError(e.details);
        if (objError.statusCode === 404) {
          RpcStringError(
            `Dictionary with id=${dictionaries[i]} does not exist`,
            HttpStatus.NOT_FOUND,
          );
        }
      }
    }
    return quiz;
  }

  private makeWordsForQuiz(words: GetDictionaryWordsResType['data']): {
    word: string;
    translate: string;
    variants: string[];
  }[] {
    return words
      .sort((a, b) => Math.random() - 0.5)
      .map((el) => {
        // console.log(el);

        const variants = [el.translate];
        for (let i = 0; i < words.length; i++) {
          if (variants.length === 3) {
            break;
          }

          const word = words[i];
          if (!variants.find((variant) => variant === word.translate)) {
            variants.push(word.translate);
          }
        }
        return {
          word: el.title,
          translate: el.translate,
          variants,
        };
      });
  }
}
