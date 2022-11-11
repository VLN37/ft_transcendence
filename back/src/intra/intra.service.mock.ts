import { faker } from '@faker-js/faker';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from 'src/auth/dto/TokenPayload';
import { IntraUser } from 'src/users/dto/intraUser.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class IntraServiceMock {
  private readonly logger = new Logger(IntraServiceMock.name);

  private readonly users = {};

  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async getUserToken(code: string) {
    let users: UserDto[] = await this.usersService.getAll();
    console.log(users);
    if (!users.length) {
      await this.usersService.generateUsers(20);
      users = await this.usersService.getAll();
    }
    const i = faker.datatype.number({
      min: 1,
      max: users.length,
    });
    const payload: TokenPayload = {
      sub: users[i].id,
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

    let user: IntraUser = this.users[access_token];
    if (!user) {
      user = {
        id: faker.datatype.number({ min: 15000, max: 500000 }),
        login: faker.random.alpha(8),
        displayname: faker.name.fullName(),
        image_url: faker.internet.avatar(),
      };
      this.users[access_token] = user;
    }
    return user;
  }
}
