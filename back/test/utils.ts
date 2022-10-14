import { faker } from '@faker-js/faker';
import axios from 'axios';
import { UserDto } from 'src/users/dto/user.dto';

export const url = 'http://localhost:3000';

export function makeUsers(amount: number) {
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
    axios.post(url + '/users', newUser).catch(() => {});
  }
}

export function deleteUsers(amount: number) {
  for (var i = 1; i < amount + 1; i++) {
    axios.delete(url + '/users/' + i.toString()).catch(() => {});
  }
}
