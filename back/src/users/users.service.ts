import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

function byId(id: number) {
  return {
    where: { id },
    relations: {
      friends: true,
      blocked: true,
    },
  };
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(dto: UserDto) {
    const newUser = await this.usersRepository.save({
      login_intra: dto.login_intra,
      tfa_enabled: dto.tfa_enabled,
      status: dto.status,
    });
    return newUser;
  }

  edit(id: number, user: User) {
    this.usersRepository.update(id, user);
    const updatedUser = this.usersRepository.findOneBy({ id: id });
    return updatedUser;
  }

  delete(id: number) {
    const deletedUser = this.usersRepository.delete({ id: id });
    return deletedUser;
  }

  get(): Promise<User[]> {
    const users = this.usersRepository.find({
      relations: {
        friends: true,
        blocked: true,
      },
    });
    return users;
  }

  findOne(id: number) {
    const user = this.usersRepository.findOneBy({ id: id });
    return user;
  }

  async blockUser(id: number, userId: number) {
    const user = await this.usersRepository.findOne(byId(id));
    if (!user) throw new NotFoundException('User not found');

    if (id == userId) throw new BadRequestException("You can't block yourself");

    if (user.blocked.find((userToBlock) => userToBlock.id == userId))
      throw new BadRequestException('User has already been blocked');

    const userToBlock = await this.usersRepository.findOne(byId(userId));
    if (!userToBlock) throw new NotFoundException('User to block not found');

    user.blocked.push(userToBlock);

    return await this.usersRepository.save(user);
  }

  async unblockUser(id: number, userId: number) {
    const user = await this.usersRepository.findOne(byId(id));
    if (!user) throw new NotFoundException('User not found');

    if (id == userId)
      throw new BadRequestException("You can't unblock yourself");

    if (!user.blocked.find((userToBlock) => userToBlock.id == userId))
      throw new BadRequestException('User was not blocked');

    const userToUnblock = await this.usersRepository.findOne(byId(userId));
    if (!userToUnblock) throw new NotFoundException('User to block not found');

    user.blocked = user.blocked.filter((userToUnblock) => userToUnblock.id != userId);

    return await this.usersRepository.save(user);
  }

  async addFriend(userId: number, friendId: number) {
    if (userId == friendId)
      throw new BadRequestException("You can't be your own friend");

    const user = await this.usersRepository.findOne(byId(userId));
    const friend = await this.usersRepository.findOne(byId(friendId));

    user.friends.push(friend);
    friend.friends.push(user);

    this.usersRepository.save(user);
    this.usersRepository.save(friend);
  }
}
