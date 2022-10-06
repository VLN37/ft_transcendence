import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor() {
    //call intra auth if user do not have token and call validate
    super();
  }

  //validate user info after super call
  async validate(payload): Promise<any> {
    return payload;
  }
}
