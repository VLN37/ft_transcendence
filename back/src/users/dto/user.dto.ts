import { IsNotEmpty } from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  login_intra: string;

  @IsNotEmpty()
  tfa_enabled: boolean;

  @IsNotEmpty()
  status: string;
}
