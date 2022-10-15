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

  //select * from users inner join friends_request on ("usersId_1"=users.id) where "usersId_2" = 1;
  private async userSentPendingFriendRequests(id: number) {
    const users = await this.usersRepository.query(
      `select * from users inner join friends_request on ("usersId_1"=users.id) where "usersId_2" = ${id};`,
    );
    return users.map((user) => {
      return {
        id: user.id,
      };
    });
  }

  async request(from: number, to: number) {
    const user = await this.usersService.findOne(from);
    if (!user) throw new NotFoundException('User not found');

    if (user.id == to) throw new BadRequestException("You can't add yourself");

    const userToAdd = await this.usersService.findOne(to);
    if (!userToAdd) throw new NotFoundException('User to add not found');

    if (userToAdd.friends_request.find((user) => user.id == to))
      throw new BadRequestException('Friend request already been sent');

    userToAdd.friends_request.push(user);

    this.logger.log(
      `User ${user.login_intra} send a friend request to ${userToAdd.login_intra}`,
    );

    await this.usersService.update(userToAdd);
    return await this.userSentPendingFriendRequests(1);
  }
}
