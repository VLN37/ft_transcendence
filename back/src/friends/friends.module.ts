import { Module } from '@nestjs/common';
import { FriendsController } from './friends.controller';
import { FriendService } from './friends.service';

@Module({
  imports: [],
  controllers: [FriendsController],
  providers: [FriendService],
})
export class FriendsModule {}
