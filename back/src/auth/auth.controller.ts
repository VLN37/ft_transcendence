import { Controller, Get, Query } from '@nestjs/common';

@Controller()
export class AuthController {
  @Get('auth-callback')
  auth(@Query('code') code: any) {
    return code;
  }
}
