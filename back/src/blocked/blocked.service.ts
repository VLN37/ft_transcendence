import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class BlockedService {
  constructor(private usersService: UsersService) {}

  async get(id: number) {
    const user = await this.usersService.findOne(id);
    if (user) return user.blocked;
    throw new NotFoundException('User not found');
  }
}
