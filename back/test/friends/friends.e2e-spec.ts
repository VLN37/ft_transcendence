import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { getTestDbModule } from '../utils';
import { FriendsModule } from 'src/users/friends/friends.module';

describe('friends api endpoints', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const testDbModule = getTestDbModule();
    const moduleRef = await Test.createTestingModule({
      imports: [testDbModule, FriendsModule],
    }).compile();

    app = moduleRef.createNestApplication();

    await app.init();
  });

  afterAll(async () => {
    if (app) app.close();
  });

  it('user should have 0 friends', async () => {
    await request(app.getHttpServer())
      .get('/users/1/friends')
      .expect(200)
      .expect([]);
  });
});
