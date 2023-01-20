import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class IntraService {
  private readonly logger = new Logger(IntraService.name);

  private handleIntraError(result: any) {
    this.logger.error('Failed to login on Intranet', {
      body: result,
    });

    if (result.error === 'invalid_client') {
      throw new InternalServerErrorException('Invalid client credentials');
    }
    throw new UnauthorizedException('Failed to login on Intranet');
  }

  async getUserToken(code: string) {
    const tokenUrl = process.env.INTRA_TOKEN_URL;
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;

    const body = {
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: process.env.HOSTNAME + '/auth-callback',
      code: code,
    };
    this.logger.debug('Authenticating at 42 Intra', { request_body: body });

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) this.handleIntraError(await response.clone().json());

    const result = await response.json();
    this.logger.debug({ result });
    return result;
  }

  async getUserInfo(access_token: string) {
    const userResponse = await fetch('https://api.intra.42.fr/v2/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!userResponse.ok)
      throw new UnauthorizedException('Failed to get user information');

    const result = await userResponse.json();
    this.logger.log('returning info for user: ' + result.login);
    return result;
  }
}
