import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { MatchMakingGateway } from './match-making.gateway';
import { MatchMakingService } from './match-making.service';

@Module({
  controllers: [],
  providers: [MatchMakingGateway, MatchMakingService, JwtService],
  imports: [UsersModule],
  exports: [],
})
export class MatchMakingModule {}
