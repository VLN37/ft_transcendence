import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from 'src/entities/match.entity';
import { UsersModule } from 'src/users/users.module';
import { MatchManagerGateway } from './match-manager.gateway';
import { MatchManagerService } from './match-manager.service';

@Module({
  imports: [TypeOrmModule.forFeature([Match]), UsersModule],
  providers: [MatchManagerGateway, MatchManagerService, JwtService],
  exports: [MatchManagerService],
})
export class MatchManagerModule {}
