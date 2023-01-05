import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvatarUploadModule } from 'src/avatar-upload/avatar-upload.module';
import { ChannelsModule } from 'src/channels/channels.module';
import { DirectMessages } from 'src/entities/direct_messages.entity';
import { MatchManagerModule } from 'src/match-manager/match-manager.module';
import { UsersModule } from 'src/users/users.module';
import { DirectMessagesController } from './direct-messages.controller';
import { DirectMessagesGateway } from './direct-messages.gateway';
import { DirectMessagesService } from './direct-messages.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([DirectMessages]),
    JwtModule.register({}),
    UsersModule,
    AvatarUploadModule,
	  ChannelsModule,
    MatchManagerModule,
  ],
  controllers: [DirectMessagesController],
  providers: [DirectMessagesService, DirectMessagesGateway],
  exports: [],
})
export class DirectMessagesModule {}
