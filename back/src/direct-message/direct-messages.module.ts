import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DirectMessages } from 'src/entities/direct_messages.entity';
import { UsersModule } from 'src/users/users.module';
import { DirectMessagesController } from './direct-messages.controller';
import { DirectMessagesGateway } from './direct-messages.gateway';
import { DirectMessagesService } from './direct-messages.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([DirectMessages]),
    JwtModule.register({}),
    UsersModule
  ],
  controllers: [DirectMessagesController],
  providers: [DirectMessagesService, DirectMessagesGateway],
  exports: [],
})
export class DirectMessagesModule {}
