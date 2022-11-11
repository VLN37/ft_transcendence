import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from 'src/entities/channel.entity';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';
import { ChannelsSocketGateway } from './channels.gateway';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ChannelsInterceptor } from './channels.interceptor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Channel]),
    JwtModule.register({}),
    UsersModule,
  ],
  controllers: [ChannelsController],
  providers: [ChannelsService, ChannelsSocketGateway, ChannelsInterceptor],
  exports: [],
})
export class ChannelsModule {}
