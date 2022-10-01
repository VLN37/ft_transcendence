import {
  Controller,
  Get,
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
    private config: ConfigService) { }

  @Get()
  @Redirect('/')
  roots() {
    return { url: this.config.get('INTRA_AUTH_URL') }
  }

  @UseGuards(FortytwoGuard)
  @Get('auth-callback')
  auth() {
    console.log('OAUTH succesful');
    return this.authService.auth(123);
  }
}
