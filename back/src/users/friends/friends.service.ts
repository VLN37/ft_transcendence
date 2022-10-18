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
    const user = await this.usersService.findOne(from);
    if (user) return user.friends;
    throw new NotFoundException('User not found');
  }

  async del(from: number, to: number) {
    const user = await this.usersService.findOne(from);
    if (!user) throw new NotFoundException('User not found');

    if (user.id == to)
      throw new BadRequestException("You can't remove yourself");

    const friend = await this.usersService.findOne(to);
    if (!friend) throw new NotFoundException('Friend does not exist');

    if (!user.friends.find((friend) => friend.id == to))
      throw new BadRequestException('You are not friends with this user');

    user.friends = user.friends.filter((user) => user.id != friend.id);
    friend.friends = friend.friends.filter((friend) => friend.id != user.id);

    await this.usersService.update(user);
    await this.usersService.update(friend);

    return user;
  }
}
