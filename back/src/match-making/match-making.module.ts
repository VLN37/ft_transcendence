import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { MatchMakingGateway } from './match-making.gateway';
import { MatchMakingService } from './match-making.service';

@Module({
  controllers: [],
  providers: [MatchMakingGateway, MatchMakingService],
  imports: [UsersModule],
  exports: [],
})
export class MatchMakingModule {}
