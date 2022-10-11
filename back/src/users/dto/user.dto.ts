import { IsNotEmpty, IsOptional } from 'class-validator';
import { Profile } from 'src/entities/profile.entity';

export class UserDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  login_intra: string;

  @IsOptional()
  tfa_enabled: boolean;

  @IsOptional()
  profile?: Profile;
}
