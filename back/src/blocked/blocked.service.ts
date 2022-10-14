import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class BlockedService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private usersService: UsersService) {}

  async get(from: number) {
    const user = await this.usersService.findOne(from);
    if (user) return user.blocked;
    throw new NotFoundException('User not found');
  }

  async block(from: number, to: number) {
    const user = await this.usersService.findOne(from);
    if (!user) throw new NotFoundException('User not found');

    if (user.id == to)
      throw new BadRequestException("You can't block yourself");

    const userToBlock = await this.usersService.findOne(to);
    if (!userToBlock) throw new NotFoundException('User to block not found');

	this.logger.error(JSON.stringify(userToBlock));

    if (user.blocked.find((userToBlock) => userToBlock.id == to))
      throw new BadRequestException('User has already been blocked');

    user.blocked.push(userToBlock);

    this.logger.log(
      `User ${user.login_intra} blocked user ${userToBlock.login_intra}`,
    );

    return await this.usersService.update(user);
  }
}
