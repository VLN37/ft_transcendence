import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { ProfileModule } from 'src/profile/profile.module';
import { BlockedService } from 'src/users/blocked/blocked.service';
import { BlockedController } from 'src/users/blocked/blocked.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ProfileModule],
  controllers: [UsersController, BlockedController],
  providers: [UsersService, BlockedService],
  exports: [UsersService],
})
export class UsersModule {}
