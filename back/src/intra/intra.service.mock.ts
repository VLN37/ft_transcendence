import { faker } from '@faker-js/faker';
import { Injectable, Logger } from '@nestjs/common';
import { IntraUser } from 'src/users/dto/intraUser.dto';

@Injectable()
export class IntraServiceMock {
  private readonly logger = new Logger(IntraServiceMock.name);

  private readonly users = {};

  async getUserToken(code: string) {
    this.logger.debug('faking user token');
    return {
      access_token: faker.random.alpha(50),
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
