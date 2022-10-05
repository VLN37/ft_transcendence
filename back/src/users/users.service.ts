import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

function byId(id: number) {
  return {
    where: { id },
    relations: {
      friends: true,
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
        }
      );
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
      },
    });
    return users;
  }

  findOne(id: number) {
    const user = this.usersRepository.findOneBy({ id: id });
    return user;
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
