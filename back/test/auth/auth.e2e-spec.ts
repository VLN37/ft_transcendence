import { INestApplication, UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthModule } from 'src/auth/auth.module';
import { IntraService } from 'src/intra/intra.service';
import * as request from 'supertest';
import { getTestDbModule } from 'test/utils';

describe('Authentication', () => {
  let app: INestApplication;
  let intraServiceMock = {
    async getUserToken(code: string) {
      return {};
    },
    async getUserInfo(access_token: string) {
      return {};
    },
  };

  beforeAll(async () => {
    const testDbModule = getTestDbModule();
    process.env.JWT_SECRET = 'test secret';
    const moduleRef = await Test.createTestingModule({
      imports: [testDbModule, AuthModule],
    })
      .overrideProvider(IntraService)
      .useValue(intraServiceMock)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should authenticate a user with the right code', async () => {
    jest
      .spyOn(intraServiceMock, 'getUserToken')
      .mockImplementationOnce(async () => {
        return {
          access_token: 'abcdefg',
        };
      });
    jest
      .spyOn(intraServiceMock, 'getUserInfo')
      .mockImplementationOnce(async () => {
        return {
          id: 42,
          login: 'psergio-',
          displayname: 'Paulo',
          image_url: null,
        };
      });
    const code = 'abcd';
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ code });

    expect(response.status).toBe(201);
    expect(intraServiceMock.getUserInfo).toHaveBeenCalledWith('abcdefg');
    expect(response.body).toHaveProperty('access_token');
  });

  it("should return 401 if intra doesn't validate the code", async () => {
    jest
      .spyOn(intraServiceMock, 'getUserToken')
      .mockImplementationOnce(async (code) => {
        throw new UnauthorizedException('Mocked unauthorized exception');
      });
    const code = 'abcd';
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ code });

    expect(response.status).toBe(401);
    expect(intraServiceMock.getUserInfo).not.toHaveBeenCalled();
    expect(response.body).toEqual({
      error: 'Unauthorized',
      message: 'Mocked unauthorized exception',
      statusCode: 401,
    });
  });
});
