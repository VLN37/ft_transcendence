import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from 'src/entities/match.entity';
import { UsersModule } from 'src/users/users.module';
import { MatchMakingGateway } from './match-making.gateway';
import { MatchMakingService } from './match-making.service';

@Module({
  controllers: [],
  providers: [MatchMakingGateway, MatchMakingService, JwtService],
  imports: [TypeOrmModule.forFeature([Match]), UsersModule],
  exports: [],
})
export class MatchMakingModule {}
