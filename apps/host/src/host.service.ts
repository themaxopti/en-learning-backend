import { Injectable } from '@nestjs/common';

@Injectable()
export class HostService {
  getHello(): string {
    return 'Hello World!';
  }
}
