import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { UserDto } from '../dto/user.dto';
import { UsersService } from '../users.service';

@Injectable()
export class FriendRequestsService {
  private readonly logger = new Logger(FriendRequestsService.name);

  constructor(
    private usersService: UsersService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  private async userSentPendingFriendRequests(
    id: number,
  ): Promise<Partial<User[]>> {
    const users = await this.usersRepository.query(
      `select users.*, profiles.*
        from users
        inner join friends_request on ("usersId_1" = users.id)
        inner join profiles on (users.id = profiles.id)
        where "usersId_2" = ${id};`,
    );
    return users.map((user): Partial<User> => {
      return {
        id: user.id,
        login_intra: user.login_intra,
        profile: {
          id: user.profile_id,
          avatar_path: user.avatar_path,
          nickname: user.nickname,
          status: user.status,
          name: user.name,
          losses: user.losses,
          wins: user.wins,
          mmr: user.mmr,
        },
      };
    });
  }

  async request(from: number, to: number) {
    const user = await this.usersService.findOne(from);
    if (!user) throw new NotFoundException('User not found');

    if (user.id == to) throw new BadRequestException("You can't add yourself");

    const userToAdd = await this.usersService.findOne(to);
    if (!userToAdd) throw new NotFoundException('User to add not found');

    if (userToAdd.friends_request.find((user) => user.id == from))
      throw new BadRequestException('Friend request already been sent');

    userToAdd.friends_request.push(user);

    this.logger.log(
      `User ${user.login_intra} send a friend request to ${userToAdd.login_intra}`,
    );

    await this.usersService.update(userToAdd);
    return await this.userSentPendingFriendRequests(from);
  }

  async cancelRequest(from: number, to: number) {
    const user = await this.usersService.findOne(from);
    if (!user) throw new NotFoundException('User not found');

    if (user.id == to)
      throw new BadRequestException(
        "You can't cancel a friend request sent to yourself",
      );

    const userToCancelRequest = await this.usersService.findOne(to);
    if (!userToCancelRequest)
      throw new NotFoundException('User pending friend request not found');

    if (!userToCancelRequest.friends_request.find((user) => user.id == from))
      throw new BadRequestException(
        'You do not have a pending friend request with this user',
      );

    userToCancelRequest.friends_request =
      userToCancelRequest.friends_request.filter((user) => user.id != from);

    this.logger.log(
      `User ${user.login_intra} cancel a pending friend request with ${userToCancelRequest.login_intra}`,
    );

    await this.usersService.update(userToCancelRequest);
    return await this.userSentPendingFriendRequests(from);
  }
}
