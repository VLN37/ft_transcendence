import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { AuthService } from './auth.service';
import { stringify } from 'querystring';
import { ConfigService } from '@nestjs/config';



@Injectable()
export class FortytwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor(
    private AuthService: AuthService,
    private http: HttpService,
    private config: ConfigService
  ) {
    const clientID = config.get('CLIENT_ID');
    const clientSecret = config.get('CLIENT_SECRET');
    const callbackURL = config.get('CONFIG_URL');
    super({
      AuthorizationUrl: `https://api.intra.42.fr/oauth/token/authorize?${ stringify({
        client_id: clientID,
        redirect_uri: callbackURL,
        response_type: 'code'
      }) }`,
      tokenURL: 'https://api.intra.42.fr/oauth/token',
      clientSecret,
    });
  }

  async validate(accessToken: string): Promise<any> {
    const { data } = await this.http.get('https://api.intra.42.fr/v2/me',{
      headers: { Authorization: `Bearer ${ accessToken }` },
    })
    .toPromise();
    return data.id;
  }
}
