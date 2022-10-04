import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(user: User) {
    const newUser = await this.usersRepository.save(user);
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

  async addFriend(user: User, friendId: number) {
    const friend = await this.usersRepository.findOneBy({ id: friendId });

    user.friends = [friend];
    friend.friends = [user];

    this.usersRepository.save(user);
    this.usersRepository.save(friend);
  }
}
