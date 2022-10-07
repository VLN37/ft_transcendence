import { IsNotEmpty } from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  login_intra: string;
}
