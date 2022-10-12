import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserStatus } from 'src/entities/profile.entity';

export class ProfileDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  nickname: string;

  @IsString()
  @IsOptional()
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
