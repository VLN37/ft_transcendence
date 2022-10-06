import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FortytwoStrategy } from './strategy/42.strategy';
import { LocalStrategy } from './strategy/local.strategy';

@Module({
  imports: [HttpModule],
  controllers: [AuthController],
  providers: [AuthService, FortytwoStrategy, LocalStrategy],
})
export class AuthModule {}
