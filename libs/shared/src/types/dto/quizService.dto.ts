export class GetQuizDto {
  quizId?: string;
  userId?: number;
  dictionaryId?: number;
  id?: number;
}

export class GetQuizzesDto {
  userId?: number;
  limit: number;
  offset: number;
}

export class CreateQuizDto {
  title?: string;
  dictionaries: number[];
  userId?: number;
}

export class RemoveQuizDto {
  id: number;
}
