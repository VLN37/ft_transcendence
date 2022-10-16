import { faker } from '@faker-js/faker';
import { TypeOrmModule } from '@nestjs/typeorm';
import axios from 'axios';
import { Profile } from 'src/entities/profile.entity';
import { User } from 'src/entities/user.entity';
import { UserDto } from 'src/users/dto/user.dto';
import { getConnection } from 'typeorm';

export const url = 'http://localhost:3000';

export function getTestDbModule() {
  return TypeOrmModule.forRoot({
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
  });
}

export function generateUsers(amount: number) {
  const users = [];

  for (let i = 0; i < amount; i++) {
    const nick = faker.name.firstName();
    const id = 20000 + i;
    const newUser: UserDto = {
      id: id,
      login_intra: nick,
      tfa_enabled: false,
      tfa_secret: null,
      profile: {
        id: id,
        name: faker.name.fullName(),
        nickname: nick,
        avatar_path: faker.image.food(),
        status: 'OFFLINE',
        wins: 0,
        losses: 0,
        mmr: 0,
      },
    };
    users.push(newUser);
  }

  return users;
}

export async function makeUsers(amount: number) {
  for (var i = 1; i < amount + 1; i++) {
    const nick = faker.name.firstName();
    const newUser: UserDto = {
      id: i,
      login_intra: nick,
      tfa_enabled: false,
      tfa_secret: null,
      profile: {
        id: i,
        name: faker.name.fullName(),
        nickname: nick,
        avatar_path: faker.image.food(),
        status: 'OFFLINE',
        wins: 0,
        losses: 0,
        mmr: 0,
      },
    };
    try {
      await axios.post(url + '/users', newUser);
    } catch (error) {}
  }
}

export async function deleteUsers(amount: number) {
  for (var i = 1; i < amount + 1; i++) {
    try {
      await axios.delete(url + '/users/' + i.toString());
    } catch (error) {}
  }
}
