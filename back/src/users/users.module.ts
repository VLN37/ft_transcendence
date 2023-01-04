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
import { GameRequestsController } from './game_requests/game_requests.controller';
import { GameRequestsService } from './game_requests/game_requests.service';
import { MatchManagerModule } from 'src/match-manager/match-manager.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ProfileModule, forwardRef(() => MatchManagerModule)],
  controllers: [
    UsersController,
    FriendsController,
    BlockedController,
    FriendRequestsController,
    GameRequestsController,
  ],
  providers: [
    UsersService,
    FriendService,
    BlockedService,
    FriendRequestsService,
    JwtService,
    GameRequestsService
  ],
  exports: [
    UsersService,
    GameRequestsService,
    ProfileModule,
    FriendRequestsService,
    TypeOrmModule,
  ],
})
export class UsersModule {}
