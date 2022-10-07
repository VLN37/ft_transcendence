import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FortytwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor(config: ConfigService) {
    //call intra auth if user do not have token and call validate
    super({
      clientID: config.get('CLIENT_ID'),
      clientSecret: config.get('CLIENT_SECRET'),
      callbackURL: config.get('CONFIG_URL'),
      profileFields: {
        'id': 'id',
        'username': 'login',
        'displayName': 'displayname',
        'name.familyName': 'last_name',
        'name.givenName': 'first_name',
        'profileUrl': 'url',
        'emails.0.value': 'email',
        'phoneNumbers.0.value': 'phone',
        'photos.0.value': 'image_url',
      },
    });
  }

  //validate user info after super call
  async validate(accessToken, refreshToken, profile, cb): Promise<any> {
    delete profile._raw;
    delete profile._json;
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      profile,
    };
  }
}
