import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IntraService } from 'src/intra/intra.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    private intraService: IntraService,
    private usersService: UsersService,
  ) {}

  async login(code: string) {
    if (!code) throw new BadRequestException('No code provided');

    const token = await this.intraService.getUserToken(code);

    if (!token.access_token) throw new BadRequestException('Invalid token');

    const user = await this.intraService.getUserInfo(token.access_token);
    this.logger.log('user fetched: ' + user.login);

    const found = await this.usersService.findOne(user.id);
    if (!found)
      await this.usersService.create({
        id: user.id,
        login_intra: user.login,
        tfa_enabled: false,
      });

    const payload = {
      username: user.login,
      sub: user.id,
    };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
      }),
      token_type: 'bearer',
    };
  }
}
