import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString } from 'class-validator';
import { Profile } from 'src/entities/profile.entity';

export class UserDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  login_intra: string;

  @IsOptional()
  tfa_enabled: boolean;

  @IsOptional()
  profile?: Profile;
}
