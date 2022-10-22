import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserDto } from 'src/users/dto/user.dto';
import { UsersModule } from 'src/users/users.module';
import * as request from 'supertest';
import { Repository } from 'typeorm';

import { generateUsers, getTestDbModule } from '../utils';

describe('Users endpoints', () => {
  let app: INestApplication;
  const users = generateUsers(3);

  beforeAll(async () => {
    const testDbModule = getTestDbModule();
    const moduleRef = await Test.createTestingModule({
      imports: [testDbModule, UsersModule],
    }).compile();

    app = moduleRef.createNestApplication();
    const usersRepositoryToken = getRepositoryToken(User);
    const usersRepository =
      moduleRef.get<Repository<User>>(usersRepositoryToken);

    for (let i = 0; i < users.length; i++) {
      await usersRepository.save(users[i]);
    }
    await app.init();
  });

  afterAll(async () => {
    if (app) app.close();
  });

  describe('GET /users', () => {
    it('returns a list of all users', async () => {
      const expectedUsers = users.map((user) => {
        const { tfa_secret, tfa_enabled, ...rest } = user;
        return rest;
      });

      const response = await request(app.getHttpServer()).get('/users');

      expect(response.status).toBe(200);

      const resultUsers = response.body;
      expect(resultUsers[0]).toMatchObject(expectedUsers[0]);
      expect(resultUsers[1]).toMatchObject(expectedUsers[1]);
      expect(resultUsers[2]).toMatchObject(expectedUsers[2]);
    });
  });
});
