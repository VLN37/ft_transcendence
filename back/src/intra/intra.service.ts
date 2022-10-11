import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class IntraService {
  private readonly logger = new Logger(IntraService.name);

  async getUserToken(code: string) {
    const tokenUrl = process.env.INTRA_TOKEN_URL;
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: 'http://localhost/auth-callback',
        code: code,
      }),
    });

    if (!response.ok) throw new UnauthorizedException('getUserToken');

    const result = await response.json();
    this.logger.log({ result });
    return result;
  }

  async getUserInfo(access_token: string) {
    const userResponse = await fetch('https://api.intra.42.fr/v2/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!userResponse.ok) throw new UnauthorizedException('getUserInfo');

    const result = await userResponse.json();
    this.logger.log('returning info for user: ' + result.login);
    return result;
  }
}
