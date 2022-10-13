import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class DashboardService {
  constructor(private usersService: UsersService) {}

  async dataSummaryForUser(userId: number) {
    const user = await this.usersService.findOne(userId);

    if (!user) throw new NotFoundException('User not found');

    return {
      user,
    };
  }
}
