import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IntraService } from 'src/intra/intra.service';
import { UserDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/users.service';
import { authenticator } from 'otplib';
import { TokenPayload } from './dto/TokenPayload';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    private intraService: IntraService,
    private usersService: UsersService,
  ) {}

  private UserAdapter(user: any): UserDto {
    const newUser: UserDto = {
      id: user.id,
      login_intra: user.login,
      tfa_enabled: true,
      tfa_secret: '',
      profile: {
        id: user.id,
        name: user.displayname,
        nickname: user.login,
        avatar_path: user.image_url,
        status: 'OFFLINE',
        wins: 0,
        losses: 0,
        mmr: 0,
      },
    };
    return newUser;
  }

  private makeTokenResponse(payload: TokenPayload) {
    console.log({ payload });
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
      }),
      token_type: 'bearer',
    };
  }

  async login(code: string) {
    const token = await this.intraService.getUserToken(code);

    const intraUser = await this.intraService.getUserInfo(token.access_token);
    this.logger.log('user fetched: ' + intraUser.login);

    let ourUser = await this.usersService.findOne(intraUser.id);
    if (!ourUser)
      ourUser = await this.usersService.create(this.UserAdapter(intraUser));

    const payload: TokenPayload = {
      sub: intraUser.id,
      tfa_enabled: ourUser.tfa_enabled,
      is_tf_authenticated: false,
    };

    return this.makeTokenResponse(payload);
  }

  validate2fa(code: string, user: Express.User) {
    return authenticator.verify({
      token: code,
      secret: user.tfa_secret,
    });
  }

  loginWith2fa(user: Express.User) {
    const payload: TokenPayload = {
      sub: user.id,
      tfa_enabled: user.tfa_enabled,
      is_tf_authenticated: true,
    };

    return this.makeTokenResponse(payload);
  }
}
