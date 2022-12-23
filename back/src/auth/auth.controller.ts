import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { QRCodeDto } from './dto/QRCodePayload';
import { TFAPayload } from './dto/TFAPayload';
import { ToggleTFAPayload } from './dto/ToggleTFAPayload';
import { JwtAuthGuard } from './guard/jwt.guard';
import { Jwt2faAuthGuard } from './guard/jwt2fa.guard';

@Controller('/auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body('code') code: string) {
    const jwt = await this.authService.login(code);
    this.logger.log(`user logged`, { jwt });
    return jwt;
  }

  @Get('2fa')
  @UseGuards(JwtAuthGuard)
  async generate2fa(@Req() req: Request, @Res() res: Response) {
    const code: QRCodeDto = await this.authService.generateQRCode(req.user);
    return res.json(code);
  }

  @Put('2fa')
  @UseGuards(JwtAuthGuard)
  async toggle2fa(@Req() req: Request, @Body() body: ToggleTFAPayload) {
    const user = req.user;
    this.authService.validate2fa(body.tfa_code, user);
    return await this.authService.toggle2fa(user, body.state);
  }

  @Post('2fa')
  @UseGuards(Jwt2faAuthGuard)
  async loginWith2fa(@Req() req: Request, @Body() body: TFAPayload) {
    const user = req.user;
    this.authService.validate2fa(body.tfa_code, user);
    return this.authService.loginWith2fa(req.user);
  }
}
