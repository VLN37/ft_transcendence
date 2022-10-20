import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class FriendService {
  constructor(private usersService: UsersService) {}

  async get(from: number) {
    const user = await this.usersService.findUserById(from);
    return user.friends;
  }

  async del(from: number, to: number) {
    const user = await this.usersService.findUserById(from);

    if (user.id == to)
      throw new BadRequestException("You can't remove yourself");

    const friend = await this.usersService.findUserById(to);

    if (!user.friends.find((friend) => friend.id == to))
      throw new BadRequestException('You are not friends with this user');

    user.friends = user.friends.filter((user) => user.id != friend.id);
    friend.friends = friend.friends.filter((friend) => friend.id != user.id);

    await this.usersService.update(user);
    await this.usersService.update(friend);

    return user;
  }
}
