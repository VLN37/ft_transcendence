import {
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Redirect,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { FortytwoGuard } from './guard/42.guard';

@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private config: ConfigService,
  ) {}

  @Get()
  @Redirect('/')
  roots() {
    return { url: this.config.get('INTRA_AUTH_URL') };
  }

  @UseGuards(FortytwoGuard)
  @Get('auth-callback')
  auth() {
    console.log('OAUTH succesful');
    return this.authService.auth('123');
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
