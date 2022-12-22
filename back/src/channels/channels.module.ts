import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from 'src/entities/channel.entity';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ChannelsInterceptor } from './channels.interceptor';
import { ChannelMessages } from 'src/entities/channel_messages.entity';
import { BannedUsers } from 'src/entities/channel.banned.entity';
import { ChannelsSocketGateway } from './channels.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Channel, ChannelMessages, BannedUsers]),
    JwtModule.register({}),
    UsersModule,
  ],
  controllers: [ChannelsController],
  providers: [ChannelsService, ChannelsInterceptor, ChannelsSocketGateway],
  exports: [],
})
export class ChannelsModule {}
