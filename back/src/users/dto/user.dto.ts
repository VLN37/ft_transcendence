import { IsNotEmpty } from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  login_intra: string;

  tfa_enabled: boolean;
}
