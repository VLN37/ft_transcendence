import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IntraService } from 'src/intra/intra.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    private intraService: IntraService,
  ) {}

  auth2(user: any) {
    return {
      access_token: this.jwtService.sign(user, {
        secret: process.env.JWT_SECRET,
      }),
      token_type: 'bearer',
    };
  }

  async login(code: string) {
    this.logger.warn('secret: ' + process.env.JWT_SECRET);
    const token = await this.intraService.getUserToken(code);

    const user = await this.intraService.getUserInfo(token.access_token);
    this.logger.log('user fetched: ' + user.login);

    const payload = {
      username: user.login,
      sub: user.id,
    };
    const options = {
      secret: process.env.JWT_SECRET,
    };
    return {
      access_token: this.jwtService.sign(payload, options),
      token_type: 'bearer',
    };
  }

  async auth(code: string) {
    const token = this.intraService.getUserToken(code);
    if (!token) {
      throw new UnauthorizedException('invalid code');
    }
  }

  home() {
    return { message: 'kkkkkkkkkkkkkkkkkk' };
  }
}
