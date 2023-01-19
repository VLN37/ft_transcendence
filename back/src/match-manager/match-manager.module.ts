import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchEntity } from 'src/entities/match.entity';
import { UsersModule } from 'src/users/users.module';
import { MatchManagerController } from './match-manager.controller';
import { MatchManagerGateway } from './match-manager.gateway';
import { MatchManager } from './match-manager';
import { MatchManagerService } from './match-manager.service';

@Module({
  imports: [TypeOrmModule.forFeature([MatchEntity]), UsersModule],
  providers: [
    MatchManagerService,
    MatchManagerGateway,
    MatchManager,
    JwtService,
  ],
  exports: [MatchManager, MatchManagerService],
  controllers: [MatchManagerController],
})
export class MatchManagerModule {}
