import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

import { TokenPayload } from '../dto/TokenPayload';

@Injectable()
export class Jwt2faStrategy extends PassportStrategy(Strategy, 'jwt-2fa') {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  // returns a user object to be assigned to the Request.user property
  async validate(payload: TokenPayload): Promise<Express.User> {
    const userId = payload.sub;

    console.log({ payload });

    const user = await this.usersService.findOne(userId);

    const authUser: Express.User = {
      id: userId,
      login_intra: user.login_intra,
      tfa_enabled: user.tfa_enabled,
      tfa_secret: user.tfa_secret,
    };
    return authUser;
  }
}
