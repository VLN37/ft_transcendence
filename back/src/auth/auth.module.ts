import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';

@Module({
  imports: [],
  controllers: [],
  providers: [AuthService],
})
export class AuthModule {}
