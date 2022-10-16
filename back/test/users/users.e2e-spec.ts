import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { generateUsers, getTestDbModule } from '../utils';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { UserDto } from 'src/users/dto/user.dto';

describe('Users endpoints', () => {
  let app: INestApplication;
  const users = generateUsers(3);

  beforeAll(async () => {
    const testDbModule = getTestDbModule();
    const moduleRef = await Test.createTestingModule({
      imports: [testDbModule, UsersModule],
    }).compile();

    app = moduleRef.createNestApplication();
    const usersService = app.get(UsersService);

    for (let i = 0; i < users.length; i++) {
      await usersService.create(users[i]);
    }
    await app.init();
  });

  afterAll(async () => {
    if (app) app.close();
  });

  describe('GET /users', () => {
    it('returns a list of all users', async () => {
      const response = await request(app.getHttpServer()).get('/users');

      expect(response.status).toBe(200);

      const resultUsers = response.body;
      expect(resultUsers[0]).toMatchObject(users[0]);
      expect(resultUsers[1]).toMatchObject(users[1]);
      expect(resultUsers[2]).toMatchObject(users[2]);
    });
  });
});
