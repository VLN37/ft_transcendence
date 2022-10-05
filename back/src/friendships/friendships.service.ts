import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class FriendshipsService {
  constructor(private usersService: UsersService) {}

  async add(id: number, friendId: number) {
    const user = await this.usersService.findOne(id);
    if (!user) throw new NotFoundException('User not found');

    if (id == friendId)
      throw new BadRequestException("You can't add yourself as friend");

    if (user.friends.find((friendToAdd) => friendToAdd.id == friendId))
      throw new BadRequestException('User is already your friend');

    if (user.friends_request.find((friendToAdd) => friendToAdd.id == friendId))
      throw new BadRequestException('User has already sent you an invite');

    const friendToAdd = await this.usersService.findOne(friendId);
    if (!friendToAdd)
      throw new NotFoundException('User to add as friend does not exist');

    if (friendToAdd.friends.find((_user) => _user.id == user.id))
      throw new BadRequestException('User is already your friend');

    if (friendToAdd.friends_request.find((_user) => _user.id == user.id))
      throw new BadRequestException(
        'You have already sent an invitation to this user',
      );

    friendToAdd.friends_request.push(user);

    return await this.usersService.update(friendToAdd);
  }

  async remove(id: number, friendId: number) {
    const user = await this.usersService.findOne(id);
    if (!user) throw new NotFoundException('User not found');

    if (id == friendId)
      throw new BadRequestException("You can't remove yourself");

    const friendToAdd = await this.usersService.findOne(friendId);
    if (!friendToAdd)
      throw new NotFoundException(
        'User to remove from friend/pending request list does not exist',
      );

    if (
      !user.friends_request.find((friendToAdd) => friendToAdd.id == friendId) &&
      !user.friends.find((friendToAdd) => friendToAdd.id == friendId) &&
      !friendToAdd.friends_request.find((friendToAdd) => friendToAdd.id == user.id)
    )
      throw new NotFoundException(
        'The user is not on your friend/pending request list',
      );

    user.friends = user.friends.filter((user) => user.id != friendToAdd.id);
    user.friends_request = user.friends_request.filter(
      (user) => user.id != friendToAdd.id,
    );
    friendToAdd.friends = friendToAdd.friends.filter(
      (friendToAdd) => friendToAdd.id != user.id,
    );
    friendToAdd.friends_request = friendToAdd.friends_request.filter(
      (friendToAdd) => friendToAdd.id != user.id,
    );

    await this.usersService.update(friendToAdd);
    await this.usersService.update(user);

    return user;
  }

  async accept(id: number, friendId: number) {
    const user = await this.usersService.findOne(id);
    if (!user) throw new NotFoundException('User not found');

    if (id == friendId)
      throw new BadRequestException("You can't accept yourself as friend");

    if (user.friends.find((friendToAdd) => friendToAdd.id == friendId))
      throw new BadRequestException('User is already your friend');

    if (!user.friends_request.find((friendToAdd) => friendToAdd.id == friendId))
      throw new BadRequestException('User not sent you an invite');

    const friendToAdd = await this.usersService.findOne(friendId);
    if (!friendToAdd)
      throw new NotFoundException('User to accept as friend does not exist');

    user.friends_request = user.friends.filter(
      (user) => user.id != friendToAdd.id,
    );
    friendToAdd.friends_request = friendToAdd.friends.filter(
      (friendToAdd) => friendToAdd.id != user.id,
    );

    friendToAdd.friends.push(JSON.parse(JSON.stringify(user)));
    user.friends.push(JSON.parse(JSON.stringify(friendToAdd)));

    await this.usersService.update(friendToAdd);
    await this.usersService.update(user);

    return user;
  }
}
