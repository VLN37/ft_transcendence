import { Controller, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('/')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/auth/login')
  async login(@Query('code') code: string) {
    console.log({ code });

    const jwt = await this.authService.login(code);

    console.log({ jwt });
    return jwt;
  }
}
