import {
  Headers,
  Controller,
  Get,
  Param,
  Redirect,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
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
  auth(@Req() req: Request) {
    // console.log(param);
    return req.user;
  }
}
