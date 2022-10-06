import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { stringify } from 'querystring';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FortytwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor(
    private http: HttpService,
    config: ConfigService
  ) {
    const clientID = config.get('CLIENT_ID');
    const clientSecret = config.get('CLIENT_SECRET');
    const callbackURL = config.get('CONFIG_URL');
    super({
      grant_type: 'authorization_code',
      clientSecret: clientSecret,
      client_secret: clientSecret,
      clientID: clientID,
      client_id: clientID,
      tokenURL: config.get('INTRA_TOKEN_URL'),
      authorizationURL: `https://api.intra.42.fr/oauth/authorize?${ stringify({
        client_id: clientID,
        redirect_uri: callbackURL,
        response_type: 'code',
      }) }`,
    });
  }

  async validate(payload: any): Promise<any> {
    // return await this.http.get('https://api.intra.42.fr/v2/me',{
    //   headers: { Authorization: `Bearer ${ payload }` },
    // });
    // console.log(data);
    return payload;
  }
}
