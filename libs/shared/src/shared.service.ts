import { Injectable } from '@nestjs/common';

@Injectable()
export class SharedService {
  sayHi() {
    console.log('hi');
  }
}
