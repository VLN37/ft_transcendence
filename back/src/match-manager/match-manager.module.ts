import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from 'src/entities/match.entity';
import { MatchManagerService } from './match-manager.service';

@Module({
  imports: [TypeOrmModule.forFeature([Match])],
  providers: [MatchManagerService],
  exports: [MatchManagerService],
})
export class MatchManagerModule {}
