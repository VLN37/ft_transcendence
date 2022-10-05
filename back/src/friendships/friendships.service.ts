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

    if (
      !user.friends_request.find((friendToAdd) => friendToAdd.id == friendId) &&
      !user.friends.find((friendToAdd) => friendToAdd.id == friendId)
    )
      throw new NotFoundException(
        'The user is not on your friend/pending request list',
      );

    const friendToAdd = await this.usersService.findOne(friendId);
    if (!friendToAdd)
      throw new NotFoundException(
        'User to remove from friend/pending request list does not exist',
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

    this.usersService.update(friendToAdd);

    return await this.usersService.update(user);
  }
}
