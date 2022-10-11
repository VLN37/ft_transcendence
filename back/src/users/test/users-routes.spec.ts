import * as request from 'supertest';
import  { faker } from "@faker-js/faker";
import { expect } from '@jest/globals';

const baseURL = 'http://localhost:3000';
const req = request(baseURL);

interface UserInterface extends Record<string, any> {
  login_intra: string;
  tfa_enabled: boolean;
  id?: number;
}

function makeUser(name: string) {
  return {
    login_intra: name,
    tfa_enabled: false,
  }
}

describe('user api endpoints', () => {
  describe('POST /users', () => {
    let user = makeUser(faker.name.firstName());
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
      const response = await req.get('/users');
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('tfa_enabled');
      expect(response.body[0]).toHaveProperty('login_intra');
    });
  });

  describe('GET /users/:id', () => {
    let user: UserInterface = makeUser(faker.name.firstName());
    it('should create the user', async () => {
      const response = await req.post('/users').send(user);
      user.id = response.body.id;
    });
    it ('should return the created user', async () => {
      const response = await req.get(`/users/${user.id}`);
      expect(response.body).toMatchObject(user);
    });
    it('should update the user', async () => {
      user.login_intra = 'batatovisk';
      user.tfa_enabled = true;
      console.log('sent user: ', user);
      const response = await req.patch(`/users/${user.id}`).send(user);
      expect(response.body).toMatchObject(user);
    })
  });
});
