import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { User } from 'src/entities/user.entity';
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

  @ValidateNested()
  @Type(()=> ProfileDto)
  @IsOptional()
  profile?: ProfileDto;

  @IsOptional()
  friends?: User[];

  @IsOptional()
  blocked?: UserDto[];
}
