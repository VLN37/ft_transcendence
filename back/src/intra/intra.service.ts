import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class IntraService {
  private readonly logger = new Logger(IntraService.name);

  private async handleIntraError(response: Response) {
    const result = await response.json();

    this.logger.error('Failed to login on Intranet', {
      body: await response.json(),
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
      redirect_uri: 'http://localhost/auth-callback',
      code: code,
    };
    this.logger.debug('autenticando na Intra', { request_body: body });

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      this.handleIntraError(response);
    }

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

    if (!userResponse.ok)
      throw new UnauthorizedException('Failed to get user information');

    const result = await userResponse.json();
    this.logger.log('returning info for user: ' + result.login);
    return result;
  }
}
