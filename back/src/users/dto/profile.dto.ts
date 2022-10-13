import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { UserStatus } from 'src/entities/profile.entity';

export class ProfileDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nickname: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  avatar_path: string = null;

  @IsOptional()
  status: UserStatus = 'OFFLINE';

  @IsNumber()
  @IsOptional()
  wins: number = 0;

  @IsNumber()
  @IsOptional()
  losses: number = 0;

  @IsNumber()
  @IsOptional()
  mmr: number = 0;
}
