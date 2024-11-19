import { Metadata } from '@grpc/grpc-js';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Inject,
  OnModuleInit,
  Param,
  Post,
  Res,
  UseFilters,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { objectError } from '@app/shared/helpers/error.helpers';
import { Cookies } from '../decorators/cookie.decorator';
import {
  ChangeWordsIndexDto,
  CreateWordDto,
  CreateWordsDto,
  DeleteWordDto,
  DeleteWordsDto,
  GetWordsDto,
} from '@app/shared/types/dto/dictionaryService.dto';
import { HttpExceptionFilter } from '@app/shared/interceptors/excepion.interceptor';
import {
  CreateQuizDto,
  GetQuizDto,
  GetQuizzesDto,
} from '@app/shared/types/dto/quizService.dto';

interface QuizService {
  getQuiz: (args: GetQuizDto, metadata: any) => any;
  getQuizzes: (args: GetQuizzesDto, metadata: any) => any;
  addQuiz: (args: CreateQuizDto, metadata: any) => any;
}

@Controller('quiz')
@UseFilters(HttpExceptionFilter)
export class QuizController implements OnModuleInit {
  private quizService: QuizService;

  constructor(
    @Inject('QUIZ_PACKAGE') private readonly dictionaryClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.quizService =
      this.dictionaryClient.getService<QuizService>('QuizService');
  }

  @Get('/:id')
  async getQuiz(
    @Param() { id },
    @Res() res: Response,
    @Cookies('Authorization') token,
  ) {
    try {
      const metadata = new Metadata();
      metadata.add('cookie', `Authorization=${token}`);

      const response = await firstValueFrom(
        this.quizService.getQuiz({ id }, metadata),
      );
      return res.send(response);
    } catch (e) {
      console.log(e);
      const error = objectError(e.details);
      throw new HttpException(e.details, error.statusCode);
    }
  }

  @Get('/many/:userId/:limit/:offset')
  async getQuizzes(
    @Param() { userId, limit, offset },
    @Res() res: Response,
    @Cookies('Authorization') token,
  ) {
    try {
      const metadata = new Metadata();
      metadata.add('cookie', `Authorization=${token}`);

      const response = await firstValueFrom(
        this.quizService.getQuizzes({ limit, offset, userId }, metadata),
      );
      return res.send(response);
    } catch (e) {
      console.log(e);
      const error = objectError(e.details);
      throw new HttpException(e.details, error.statusCode);
    }
  }

  @Post()
  async createQuiz(
    @Body() dto,
    @Res() res: Response,
    @Cookies('Authorization') token,
  ) {
    try {
      const metadata = new Metadata();
      metadata.add('cookie', `Authorization=${token}`);

      const response = await firstValueFrom(
        this.quizService.addQuiz(dto, metadata),
      );
      return res.send(response);
    } catch (e) {
      console.log(e);
      const error = objectError(e.details);
      throw new HttpException(e.details, error.statusCode);
    }
  }
}
