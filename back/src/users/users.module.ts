import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { ProfileModule } from 'src/profile/profile.module';
import { BlockedService } from 'src/users/blocked/blocked.service';
import { BlockedController } from 'src/users/blocked/blocked.controller';
import { FriendRequestsController } from './friend_requests/friend_requests.controller';
import { FriendRequestsService } from './friend_requests/friend_requests.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ProfileModule],
  controllers: [UsersController, BlockedController, FriendRequestsController],
  providers: [UsersService, BlockedService, FriendRequestsService],
  exports: [UsersService],
})
export class UsersModule {}
