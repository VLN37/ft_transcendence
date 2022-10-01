import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FortytwoStrategy } from './42.strategy';

@Module({
  imports: [HttpModule],
  controllers: [AuthController],
  providers: [AuthService, FortytwoStrategy],
})
export class AuthModule {}
