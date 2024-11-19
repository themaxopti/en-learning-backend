import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { GrpcCookieInterceptor } from '@app/shared/interceptors/cookie.interceptor';
import { GrpcMethod } from '@nestjs/microservices';
import {
  CreateQuizDto,
  GetQuizDto,
  GetQuizzesDto,
} from '@app/shared/types/dto/quizService.dto';

@Controller()
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @UseInterceptors(GrpcCookieInterceptor)
  @GrpcMethod('QuizService', 'GetQuiz')
  async getQuiz(data: GetQuizDto, metadata: any) {
    const response = await this.quizService.find(data, metadata);
    // console.log(response);

    return {
      statusCode: 200,
      message: 'some',
      data:
        // {
        //   id: 28,
        //   title: 'some',
        //   words: [
        //     {
        //       word: 'h2',
        //       translate: 'Привет',
        //       variants: ['some'],
        //     },
        //   ],
        // },
        response,
    };
  }

  @UseInterceptors(GrpcCookieInterceptor)
  @GrpcMethod('QuizService', 'GetQuizzes')
  async getQuizzes(data: GetQuizzesDto, metadata: any) {
    const { limit, offset } = data;
    const userId = metadata.get('userId')[0];
    const quizzes = await this.quizService.findMany({ limit, offset, userId });
    return {
      statusCode: 200,
      quizzes,
    };
  }

  @UseInterceptors(GrpcCookieInterceptor)
  @GrpcMethod('QuizService', 'AddQuiz')
  async createQuiz(data: CreateQuizDto, metadata: any) {
    const userId = metadata.get('userId')[0];

    const quiz = await this.quizService.create({ ...data, userId }, metadata);
    console.log(quiz);
    
    return {
      statusCode: 200,
      data: {
        id: quiz.id,
        title: quiz.title,
        userId,
      },
    };
  }
}
