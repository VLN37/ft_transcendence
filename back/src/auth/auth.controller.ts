import { Controller, Get, Query } from '@nestjs/common';

@Controller()
export class AuthController {
  @Get('auth-callback')
  auth(@Query('code') que: any) {
    return que;
  }
}
