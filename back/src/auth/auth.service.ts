import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IntraService } from 'src/intra/intra.service';
import { ProfileService } from 'src/profile/profile.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    private intraService: IntraService,
    private usersService: UsersService,
    private profileService: ProfileService,
  ) {}

  async login(code: string) {
    const token = await this.intraService.getUserToken(code);

    const user = await this.intraService.getUserInfo(token.access_token);
    this.logger.log('user fetched: ' + user.login);

    const found = await this.usersService.findOne(user.id);
    if (!found) {
      const user2 = await this.usersService.create({
        id: user.id,
        login_intra: user.login,
        tfa_enabled: false,
      });
      const profile = await this.profileService.create({
        id: user.id,
        name: user.displayname,
        nickname: user.login,
        avatar_path: user.image_url,
        status: 'OFFLINE',
        wins: 0,
        losses: 0,
        mmr: 0,
        user: user2,
      });
      user2.profile = profile;
      await this.usersService.update(user2);
    }

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
