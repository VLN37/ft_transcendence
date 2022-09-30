import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  auth(code: number) {
    return code;
  }
}
