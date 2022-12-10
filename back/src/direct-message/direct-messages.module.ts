import { forwardRef, Module } from '@nestjs/common';
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
    forwardRef(() => UsersModule)
  ],
  controllers: [DirectMessagesController],
  providers: [DirectMessagesService, DirectMessagesGateway],
  exports: [DirectMessagesGateway, DirectMessagesService],
})
export class DirectMessagesModule {}
