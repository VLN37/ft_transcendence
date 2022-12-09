import { faker } from '@faker-js/faker';
import { TypeOrmModule } from '@nestjs/typeorm';
import axios from 'axios';
import { BannedUsers } from 'src/entities/channel.banned.entity';
import { Channel } from 'src/entities/channel.entity';
import { ChannelMessages } from 'src/entities/channel_messages.entity';
import { Profile } from 'src/entities/profile.entity';
import { User } from 'src/entities/user.entity';
import { UserDto } from 'src/users/dto/user.dto';

export const url = 'http://localhost:3000';

export function getTestDbModule() {
  return TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5433,
    username: 'user_test',
    password: 'pass_test',
    entities: [User, Profile, Channel, ChannelMessages, BannedUsers],
    database: 'transcendence_test',
    synchronize: true,
    dropSchema: true,
    logging: false,
  });
}

export function generateUser(id: number): UserDto {
  const nick = faker.name.firstName();

  return {
    id: id ?? faker.datatype.number(30000),
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
}

export function generateUsers(amount: number): UserDto[] {
  const users = [];

  for (let i = 0; i < amount; i++) {
    const id = 20000 + i;
    const newUser: UserDto = generateUser(id);
    users.push(newUser);
  }

  return users;
}

export async function makeUsers(amount: number) {
  const statusArr = ['OFFLINE', 'ONLINE', 'PLAYING', 'SEARCHING'];
  let users = [];
  var i = 1;
  for (; i < amount + 1; i++) {
    const id = faker.datatype.number({ min: 1, max: 80000 });
    const nick = faker.name.firstName().toLowerCase();

    const status: any =
      statusArr[faker.datatype.number({ min: 0, max: 3 })].toUpperCase();

    const newUser: UserDto = {
      id: id,
      login_intra: nick,
      tfa_enabled: false,
      tfa_secret: null,
      profile: {
        id: id,
        name: faker.name.fullName(),
        nickname: nick,
        avatar_path: '/avatars/gatinho.jpeg',
        // status: 'OFFLINE',
        status: status,
        wins: faker.datatype.number({ min: 1, max: 1000 }),
        losses: faker.datatype.number({ min: 1, max: 1000 }),
        mmr: faker.datatype.number({ min: 1, max: 5000 }),
      },
      friends: [],
      blocked: [],
      friend_requests: [],
    };
    try {
      await axios.post(url + '/users', newUser);
      users.push(newUser);
    } catch (error) {
      i--;
      continue;
    }
  }
  return users;
}

export async function deleteUsers(amount: number) {
  for (var i = 1; i < amount + 1; i++) {
    try {
      await axios.delete(url + '/users/' + i.toString());
    } catch (error) {}
  }
}
