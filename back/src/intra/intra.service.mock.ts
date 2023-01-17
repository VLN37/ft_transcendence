import { faker } from '@faker-js/faker';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from 'src/auth/dto/TokenPayload';
import { UserDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class IntraServiceMock {
  private readonly logger = new Logger(IntraServiceMock.name);

  private readonly specificUsers: {
    abcd: UserDto;
    '1234': UserDto;
    noob: UserDto;
  } = {
    abcd: {
      id: 42,
      login_intra: 'psergio-',
      tfa_enabled: false,
      tfa_secret: null,
      profile: {
        id: 42,
        avatar_path: '/avatars/psergio-.jpeg',
        losses: 0,
        wins: 40,
        mmr: 400,
        status: 'ONLINE',
        name: 'Paulo',
        nickname: 'psergio-',
      },
    },
    '1234': {
      id: 43,
      login_intra: 'jofelipe',
      tfa_enabled: false,
      tfa_secret: null,
      profile: {
        id: 43,
        avatar_path: '/avatars/jofelipe.jpeg',
        losses: 0,
        wins: 40,
        mmr: 400,
        status: 'ONLINE',
        name: 'Jão',
        nickname: 'jofelipe',
      },
    },
    noob: {
      id: 44,
      login_intra: 'wleite',
      tfa_enabled: false,
      tfa_secret: null,
      profile: {
        id: 44,
        avatar_path: '/avatars/wleite.jpeg',
        losses: 40,
        wins: 0,
        mmr: 0,
        status: 'ONLINE',
        name: 'Welton',
        nickname: 'wleite',
      },
    },
  };

  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async getUserToken(code: string) {

    this.logger.debug('code: ' + code);
    let id: number;

    if (process.env.ENVIRONMENT != 'prod') {
      let users: UserDto[] = await this.usersService.getAll();
      if (!users.length) {
        await this.usersService.generateUsers(20);
        await this.usersService.create(this.specificUsers['abcd']);
        await this.usersService.create(this.specificUsers['1234']);
        await this.usersService.create(this.specificUsers['noob']);
        users = await this.usersService.getAll();
      }

      if (this.specificUsers[code]) {
        id = this.specificUsers[code].id;
      } else {
        const i = faker.datatype.number({ max: 19 });
        id = users[i].id;
      }
    }
    const payload: TokenPayload = {
      sub: id,
      tfa_enabled: false,
      is_authenticated_twice: false,
    };

    this.logger.debug('faking user token');
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
      }),
      token_type: 'bearer',
    };
  }

  async getUserInfo(access_token: string) {
    this.logger.debug('faking user info');
    faker.setLocale('pt_BR');

    const id: number = this.jwtService.decode(access_token)['sub'];
    let savedUser: UserDto = await this.usersService.getOne(id);

    const user = {
      id: id,
      login: savedUser.login_intra,
      displayname: savedUser.profile.name,
      image_url: savedUser.profile?.avatar_path ?? '/avatars/gatinho.jpeg',
    };
    return user;
  }
}
