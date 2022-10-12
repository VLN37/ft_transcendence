import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ProfileDto } from './profile.dto';

export class UserDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  login_intra: string;

  @IsBoolean()
  @IsOptional()
  tfa_enabled: boolean = false;

  @IsOptional()
  profile?: ProfileDto;
}
