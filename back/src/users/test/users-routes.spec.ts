import * as request from 'supertest';
import  { faker } from "@faker-js/faker";
import { expect } from '@jest/globals';

const baseURL = 'http://localhost:3000';
const req = request(baseURL);

describe('user api endpoints', () => {
  describe('POST /users', () => {

    let user = {
      login_intra: faker.name.firstName(),
      tfa_enabled: '0',
      status: 'online',
    }
    it('should register an user', async () => {
      const response = await req.post('/users').send(user);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('tfa_enabled');
      expect(response.body).toHaveProperty('login_intra');
    });
    it('should not register the same user', async () => {
      const response = await req.post('/users').send(user);
      expect(response.status).toBeGreaterThanOrEqual(400);
    });
    it('should not register an empty user', async () => {
      user.login_intra = '';
      const response = await req.post('/users').send(user);
      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe('GET /users', () => {
    it('should return the users', async () => {
      const response = await request(baseURL).get('/users');
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('tfa_enabled');
      expect(response.body[0]).toHaveProperty('login_intra');
    });
  });
});
