import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UserDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class BlockedService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private usersService: UsersService) {}

  async get(from: number): Promise<Partial<UserDto>[]> {
    return (await this.usersService.findUserById(from)).blocked;
  }

  async block(from: number, to: number) {
    const user = await this.usersService.findUserById(from);

    if (user.id == to)
      throw new BadRequestException("You can't block yourself");

    const userToBlock = await this.usersService.findUserById(to);

    if (user.blocked.find((userToBlock) => userToBlock.id == to))
      throw new BadRequestException('User has already been blocked');

    user.blocked.push(userToBlock);

    this.logger.log(
      `User ${user.login_intra} blocked user ${userToBlock.login_intra}`,
    );

    await this.usersService.update(user);
    return (await this.usersService.findUserById(from)).blocked;
  }

  async unblock(from: number, to: number) {
    const user = await this.usersService.findUserById(from);

    if (user.id == to)
      throw new BadRequestException("You can't unblock yourself");

    const userToUnblock = await this.usersService.findUserById(to);

    if (!user.blocked.find((userToUnblock) => userToUnblock.id == to))
      throw new BadRequestException('User was not blocked');

    user.blocked = user.blocked.filter(
      (userToUnblock) => userToUnblock.id != to,
    );

    this.logger.log(
      `User ${user.login_intra} unblocked user ${userToUnblock.login_intra}`,
    );

    await this.usersService.update(user);
    return (await this.usersService.findUserById(from)).blocked;
  }
}
