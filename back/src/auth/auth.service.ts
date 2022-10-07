import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  auth2(user: any) {
    return {
      access_token: this.jwtService.sign(user, {
        secret: process.env.JWT_TOKEN,
      }),
      token_type: 'bearer',
    };
  }

  async auth(code: string) {
    const tokenUrl = process.env.INTRA_TOKEN_URL;
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    console.log({ clientId });
    console.log({ clientSecret });
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

    console.log({ response });

    const result = await response.json();

    console.log({ result });
    return result;
  }

  async getUserData(token: string) {
    const userResponse = await fetch('https://api.intra.42.fr/v2/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log({ userResponse });

    return userResponse.json();
  }

  home() {
    return { message: 'kkkkkkkkkkkkkkkkkk' };
  }
}
