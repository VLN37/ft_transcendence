import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { FriendsController } from './friends.controller';
import { FriendService } from './friends.service';

@Module({
  imports: [UsersModule],
  controllers: [FriendsController],
  providers: [FriendService],
})
export class FriendsModule {}
