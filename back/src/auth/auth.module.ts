import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { IntraModule } from 'src/intra/intra.module';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { Jwt2faStrategy } from './strategy/jwt2fa.strategy';

@Module({
  imports: [
    HttpModule,
    JwtModule.register({}),
    IntraModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, Jwt2faStrategy, JwtService],
  exports: [JwtService],
})
export class AuthModule {}
