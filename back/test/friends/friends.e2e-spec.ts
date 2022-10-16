import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import * as request from 'supertest';
import { url, generateUsers } from '../utils';
import { FriendsModule } from 'src/friends/friends.module';
import { FriendService } from 'src/friends/friends.service';
import { Profile } from 'src/entities/profile.entity';

describe('friends api endpoints', () => {
  let app: INestApplication;
  const users = generateUsers(3);
  let friendService = {
    get: (id: number) => {
      return users;
    },
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        FriendsModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5433,
          username: 'user_test',
          password: 'pass_test',
          entities: [User, Profile],
          database: 'transcendence_test',
          synchronize: true,
          dropSchema: true,
          logging: false,
        }),
      ],
    })
      .overrideProvider(FriendService)
      .useValue(friendService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    // await deleteUsers(2);
    if (app) app.close();
  });

  it('user should have 0 friends', async () => {
    await request(app.getHttpServer()).get('users/1/friends').expect({});
  });
});
