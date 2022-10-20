import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Put,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { TFAPayload } from './dto/TFAPayload';
import { ToggleTFAPayload } from './dto/ToggleTFAPayload';
import { JwtAuthGuard } from './guard/jwt.guard';
import { Jwt2faAuthGuard } from './guard/jwt2fa.guard';

@Controller('/auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private authService: AuthService) {}

  @Post('login') // /auth/login
  async login(@Body('code') code: string) {
    console.log({ code });

    const jwt = await this.authService.login(code);

    console.log({ jwt });
    return jwt;
  }

  @Get('2fa') // /auth/2fa
  @UseGuards(JwtAuthGuard)
  async generate2fa(@Req() req: Request, @Res() res: Response) {
    this.logger.log(
      'generating new 2FA QRCode for user ' + req.user.login_intra,
    );
    const { otpAuthUrl } = await this.authService.generata2faSecret(req.user);

    const dataURL = await this.authService.generateDataQrCode(otpAuthUrl);
    return res
      .setHeader('Content-type', 'text/html')
      .send(`<img src="${dataURL}" />`);
    // return res.json({
    //   qrcode_data: dataURL,
    // });
  }

  @Put('2fa') // /auth/2fa
  @UseGuards(JwtAuthGuard)
  async toggle2fa(@Req() req: Request, @Body() body: ToggleTFAPayload) {
    const code = body.tfa_code;
    const user = req.user;

    const isValid = this.authService.validate2fa(code, user);

    if (!isValid) {
      this.logger.debug(
        `user ${user.login_intra} tried to enable 2FA with ` +
          'a wrong authentication code',
      );
      throw new UnauthorizedException('Wrong authentication code');
    }

    return await this.authService.toggle2fa(user.id, body.state);
  }

  @Post('2fa') // /auth/2fa
  @UseGuards(Jwt2faAuthGuard)
  async loginWith2fa(@Req() req: Request, @Body() body: TFAPayload) {
    const code = body.tfa_code;
    const user = req.user;

    const isValid = this.authService.validate2fa(code, user);

    if (!isValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }

    return this.authService.loginWith2fa(user);
  }
}
