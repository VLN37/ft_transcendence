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
import { Channel } from 'src/entities/channel.entity';
import { ProfileDto } from './profile.dto';

export class UserDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  login_intra: string;

  @IsBoolean()
  @IsOptional()
  tfa_enabled: boolean = false;

  @IsString()
  @IsOptional()
  @MaxLength(103)
  tfa_secret: string;

  @ValidateNested()
  @Type(() => ProfileDto)
  @IsOptional()
  profile?: ProfileDto;

  @IsOptional()
  friends?: Partial<UserDto>[];

  @IsOptional()
  friend_requests?: Partial<UserDto>[];

  @IsOptional()
  blocked?: Partial<UserDto>[];

  @IsOptional()
  channels?: Partial<Channel>[];
}
