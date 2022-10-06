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
import { AuthService } from './auth.service';
import { FortytwoGuard } from './guard/42.guard';
import { FortytwoLocalGuard } from './guard/local.guard';

@Controller('/')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(FortytwoLocalGuard)
  @Get()
  home() {
    return this.authService.home();
  }

  @UseGuards(FortytwoGuard)
  @Get('auth-callback')
  auth(@Req() req: Request) {
    console.log('auth-callback');
    return JSON.stringify(req.user);
  }

  @Post('/auth/login')
  @HttpCode(200)
  async login(@Query('code') code: string) {
    console.log({ code });

    const result = await this.authService.auth(code);

    const token = result.access_token;

    const user = this.authService.getUserData(token);

    console.log({ user });
    return user;
  }
}
