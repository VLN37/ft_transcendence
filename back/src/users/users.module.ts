import { forwardRef, Module } from '@nestjs/common';
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
import { DirectMessagesGateway } from 'src/direct-message/direct-messages.gateway';
import { DirectMessagesModule } from 'src/direct-message/direct-messages.module';
import { ProfileService } from 'src/profile/profile.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ProfileModule,
    forwardRef(() => DirectMessagesModule),
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
    DirectMessagesGateway,
  ],
  exports: [UsersService, ProfileModule, FriendRequestsService],
})
export class UsersModule {}
