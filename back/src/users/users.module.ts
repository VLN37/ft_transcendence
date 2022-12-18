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
import { FriendsController } from './friends/friends.controller';
import { FriendService } from './friends/friends.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ProfileModule,
  ],
  controllers: [
    UsersController,
    FriendsController,
    BlockedController,
    FriendRequestsController,
  ],
  providers: [
    UsersService,
    FriendService,
    BlockedService,
    FriendRequestsService,
    JwtService,
  ],
  exports: [UsersService, ProfileModule, FriendRequestsService],
})
export class UsersModule {}
