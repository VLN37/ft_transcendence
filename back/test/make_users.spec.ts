import {deleteUsers, makeUsers} from './utils';
import * as request from 'supertest';

const req = request('http://localhost:3000/users')

describe('do stuff', () => {
  // deleteUsers(75);
  makeUsers(75);
  it('should do stuff', async() => {
    await req.get('').expect(200);
  });
})
