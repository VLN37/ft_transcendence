import { BadRequestException, Injectable } from '@nestjs/common';
import { iFriendRequestWsPayload } from 'src/direct-message/direct-messages.interface';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class FriendService {
  private notifyService: (
    target: number,
    data: iFriendRequestWsPayload
  ) => void | null = null;
  constructor(private usersService: UsersService) {}

  setNotify(callback: typeof this.notifyService) {
    this.notifyService = callback;
  }

  async get(from: number) {
    const user = await this.usersService.findUserById(from);
    user.friends.map((user) => {
      delete user.tfa_enabled;
      delete user.tfa_secret;
    });
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

    user.friends.map((user) => {
      delete user.tfa_enabled;
      delete user.tfa_secret;
    });
    this.notifyService(to, {user, status: 'REMOVED'});
    return user.friends;
  }
}
