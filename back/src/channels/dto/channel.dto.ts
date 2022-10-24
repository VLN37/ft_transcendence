import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ChannelType } from 'src/entities/channel.entity';

export class ChannelDto {
  id: number;

  @IsString()
  @MaxLength(255)
  name: string;

  @IsNumber()
  @IsNotEmpty()
  owner_id: number;

  @IsNotEmpty()
  type: ChannelType;

  @IsString()
  @IsOptional()
  password: string;
}
