import * as request from 'supertest';
import  { faker } from "@faker-js/faker";

const baseURL = 'http://localhost:3000';

describe('user api endpoints', () => {
  describe('POST /users', () => {
    it('should register an user', async () => {
      const response = await request(baseURL).post('/users').send({
        login_intra: faker.name.firstName(),
        tfa_enabled: '0',
        status: 'online',
      });
      expect(response).toHaveProperty('body');
      // console.log(response.body);
      expect(response.body).toHaveProperty('login_intra');
    });
  });
  describe('GET /users', () => {
    it('should return an user', async () => {
      const response = await request(baseURL).get('/users');
      // console.log(response.body);
      expect(response.body);
    });
  });
});
