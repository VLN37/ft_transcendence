import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

import { TokenPayload } from '../dto/TokenPayload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger(UsersService.name);

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

    this.logger.debug('printando payload', { payload });
    if (payload.tfa_enabled && !payload.is_authenticated_twice) {
      return null;
    }

    const user = await this.usersService.findCompleteUserById(userId);

    this.logger.debug('printando usuário logando', { user });

    if (user.tfa_enabled != payload.tfa_enabled) {
      this.logger.debug('infelizmente, a gente é um lixo');

      return null;
    }

    const authUser: Express.User = {
      id: userId,
      login_intra: user.login_intra,
      tfa_enabled: user.tfa_enabled,
      tfa_secret: user.tfa_secret,
    };
    return authUser;
  }
}
