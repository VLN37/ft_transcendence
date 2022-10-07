import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FortytwoStrategy } from './strategy/42.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [HttpModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, FortytwoStrategy, JwtStrategy],
})
export class AuthModule {}
