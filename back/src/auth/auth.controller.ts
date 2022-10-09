import {
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guard/jwt.guard';

@Controller('/')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  home() {
    return this.authService.home();
  }

  @Post('/auth/login')
  @HttpCode(200)
  async login(@Query('code') code: string) {
    console.log({ code });

    const jwt = this.authService.login(code);

    console.log({ jwt });
    return jwt;
  }
}
