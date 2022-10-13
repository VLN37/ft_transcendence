import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ProfileDto } from './profile.dto';

export class UserDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  login_intra: string;

  @IsBoolean()
  @IsOptional()
  tfa_enabled: boolean = false;

  @IsOptional()
  profile?: ProfileDto;
}
