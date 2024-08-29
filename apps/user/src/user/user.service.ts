import { Injectable } from '@nestjs/common';

@Injectable()
export class DictionaryService {
  getHello(): string {
    return 'Hello World!';
  }
}
