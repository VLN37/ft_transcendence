import * as request from 'supertest';
import  { faker } from "@faker-js/faker";
import { expect } from '@jest/globals';
import { UserDto } from '../dto/user.dto';

const baseURL = process.env.HOSTNAME + ':3000/users';
const req = request(baseURL);

function makeUser(name: string) {
  return {
    login_intra: name,
    tfa_enabled: false,
    id: Number(faker.random.numeric(5)),
  }
}

describe('user block endpoints', () => {
  let user1, user2: UserDto;

  it('should create the users', async () => {
    let response = await req.post('')
      .send(makeUser(faker.name.firstName()))
      .expect(201);
    user1 = response.body;
    console.log('user1 creation:', user1);
    response = await req.post('')
    .send(makeUser(faker.name.firstName()))
    .expect(201);
    user2 = response.body;
    console.log('user2 creation:', user2);
  });
  it('should block an user', async() => {
    let response = await req
      .post(`/${user2.id}/block`)
      .send(user1)
      .expect(201);
    console.log('blocked users', response.body.blocked);
    console.log('user1', user1);
    console.log('user2', user2);
    response = await req.get(`/${user2.id}`);
    const user = response.body;
    console.log('user final', user);
    expect(response.body.blocked[0]).toContain(user1);
  })
})
