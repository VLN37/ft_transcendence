import { ExecutionContext, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { User } from 'src/entities/user.entity';
import { UserDto } from 'src/users/dto/user.dto';
import { UsersModule } from 'src/users/users.module';
import * as request from 'supertest';
import { Repository } from 'typeorm';

import { generateUsers, getTestDbModule } from '../utils';

const customUser = {
  login_intra: 'eu',
  id: 42,
  tfa_enabled: false,
};

describe('friends api endpoints', () => {
  let app: INestApplication;
  let usersRepository: Repository<User>;
  let users: Partial<UserDto>[];

  beforeAll(async () => {
    process.env.JWT_SECRET = 'fake';
    const testDbModule = getTestDbModule();
    users = generateUsers(5);

    const moduleRef = await Test.createTestingModule({
      imports: [testDbModule, UsersModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = customUser;
          return true;
        },
      })
      .compile();

    usersRepository = moduleRef.get('UserRepository');
    await usersRepository.save(users);

    app = moduleRef.createNestApplication();

    await app.init();
  });

  afterAll(async () => {
    if (app) app.close();
  });

  test('user should initially have 0 friends', async () => {
    const userId = users[0].id;
    await request(app.getHttpServer())
      .get(`/users/${userId}/friends`)
      .expect(200)
      .expect([]);
  });

  test('user should be able to request a friendship', async () => {
    const senderId = users[0].id;
    const receiverId = users[1].id;
    await request(app.getHttpServer())
      .post(`/users/${receiverId}/friend_requests`)
      .send({ user_id: senderId })
      .expect(200);

    const user = await usersRepository.findOne({
      where: { id: receiverId },
      relations: {
        friend_requests: true,
      },
    });
    expect(user.friend_requests[0]).toBeDefined();
    expect(user.friend_requests[0].id).toBe(senderId);
  });
});
