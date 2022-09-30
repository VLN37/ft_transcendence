import { Controller, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('auth-callback')
  auth(@Query('code') code: any) {
    return this.authService.auth(code);
  }
}
