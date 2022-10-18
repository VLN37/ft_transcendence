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
        inner join friend_requests on ("usersId_1" = users.id)
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

  private async userReceivedPendingFriendRequests(
    id: number,
  ): Promise<Partial<User[]>> {
    const users = await this.usersRepository.query(
      `select users.*, profiles.*
        from users
        inner join friend_requests on ("usersId_2" = users.id)
        inner join profiles on (users.id = profiles.id)
        where "usersId_1" = ${id};`,
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

  async request(me: number, target: number) {
    const user = await this.usersService.findOne(me);
    if (!user) throw new NotFoundException('User not found');

    if (user.id == target)
      throw new BadRequestException("You can't add yourself");

    const userToAdd = await this.usersService.findOne(target);
    if (!userToAdd) throw new NotFoundException('User to add not found');

    if (userToAdd.friend_requests.find((user) => user.id == me))
      throw new BadRequestException('Friend request already been sent');

    userToAdd.friend_requests.push(user);

    this.logger.log(
      `User ${user.login_intra} send a friend request to ${userToAdd.login_intra}`,
    );

    await this.usersService.update(userToAdd);
    return await this.userSentPendingFriendRequests(me);
  }

  async cancelRequest(me: number, target: number) {
    const user = await this.usersService.findOne(me);
    if (!user) throw new NotFoundException('User not found');

    if (user.id == target)
      throw new BadRequestException(
        "You can't cancel a friend request sent to yourself",
      );

    const userToCancelRequest = await this.usersService.findOne(target);
    if (!userToCancelRequest)
      throw new NotFoundException('User pending friend request not found');

    if (!userToCancelRequest.friend_requests.find((user) => user.id == me))
      throw new BadRequestException(
        'You do not have a pending friend request with this user',
      );

    userToCancelRequest.friend_requests =
      userToCancelRequest.friend_requests.filter((user) => user.id != me);

    this.logger.log(
      `User ${user.login_intra} cancel a pending friend request with ${userToCancelRequest.login_intra}`,
    );

    await this.usersService.update(userToCancelRequest);
    return await this.userSentPendingFriendRequests(me);
  }

  async acceptRequest(me: number, target: number) {
    const user = await this.usersService.findOne(me);
    if (!user) throw new NotFoundException('User not found');

    if (user.id == target)
      throw new BadRequestException(
        "You can't accept a friend request sent to yourself",
      );

    const userToAcceptRequest = await this.usersService.findOne(target);
    if (!userToAcceptRequest)
      throw new NotFoundException('User pending friend request not found');

    if (
      user.friends.find(
        (userToAcceptRequest) => userToAcceptRequest.id == target,
      )
    )
      throw new BadRequestException('You are already friends');

    if (
      !user.friend_requests.find(
        (userToAcceptRequest) => userToAcceptRequest.id == target,
      )
    )
      throw new BadRequestException(
        'You do not have a pending friend request with this user',
      );

    user.friend_requests = user.friend_requests.filter(
      (userToAcceptRequest) => userToAcceptRequest.id != target,
    );

    user.friends.push(await this.usersService.findOne(target));
    userToAcceptRequest.friends.push(await this.usersService.findOne(me));

    this.logger.log(
      `User ${user.login_intra} accepted a pending friend request with ${userToAcceptRequest.login_intra}`,
    );

    await this.usersService.update(user);
    await this.usersService.update(userToAcceptRequest);
    return user.friends;
  }

  async updateRequest(me: number, target: number, status: string) {
    const user = await this.usersService.findOne(me);
    if (!user) throw new NotFoundException('User not found');

    if (user.id == target)
      throw new BadRequestException(
        "You can't accept/decline a friend request sent to yourself",
      );

    const userToUpdateRequest = await this.usersService.findOne(target);
    if (!userToUpdateRequest)
      throw new NotFoundException('User pending friend request not found');

    if (status == 'ACCEPTED') return await this.acceptRequest(me, target);
    if (status == 'DECLINED') return await this.cancelRequest(me, target);

    throw new BadRequestException('Invalid param, (ACCEPTED/DECLINED)');
  }

  async pendingRequest(me: number, type: string) {
    const user = await this.usersService.findOne(me);
    if (!user) throw new NotFoundException('User not found');

    if (type == 'sent') return await this.userSentPendingFriendRequests(me);
    if (type == 'received')
      return await this.userReceivedPendingFriendRequests(me);

    throw new BadRequestException('Invalid param, (sent/received)');
  }
}
