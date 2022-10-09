import {
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { IntraService } from 'src/intra/intra.service';
import { AuthService } from './auth.service';
import { FortytwoGuard } from './guard/42.guard';
import { JwtAuthGuard } from './guard/jwt.guard';

@Controller('/')
export class AuthController {
  constructor(
    private authService: AuthService,
    private intraService: IntraService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  home() {
    return this.authService.home();
  }

  @UseGuards(FortytwoGuard)
  @Get('auth-callback')
  auth(@Req() req: Request) {
    return this.authService.auth2(req.user);
  }

  @Post('/auth/login')
  @HttpCode(200)
  async login(@Query('code') code: string) {
    console.log({ code });

    const user = this.authService.login(code);

    console.log({ user });
    return user;
  }
}
