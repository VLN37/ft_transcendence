import { IsNotEmpty } from 'class-validator';
import { Profile } from 'src/entities/profile.entity';

export class UserDto {
  id: number;

  @IsNotEmpty()
  login_intra: string;

  tfa_enabled: boolean;

  profile?: Profile;
}
