import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { BannedUsers } from 'src/entities/channel.banned.entity';
import { ChannelMessages } from 'src/entities/channel_messages.entity';
import { ChannelType } from 'src/entities/types/channelTypes';
import { UserDto } from 'src/users/dto/user.dto';

export class ChannelDto {
  @IsOptional()
  id: number;

  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  owner_id: number;

  @IsNotEmpty()
  type: ChannelType;

  @ValidateIf((o) => o.type === 'PROTECTED')
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ValidateIf((o) => o.type === 'PRIVATE')
  @IsNotEmpty()
  allowed_users?: Partial<UserDto>[];

  @IsOptional()
  users?: Partial<UserDto>[];

  @IsOptional()
  admins?: Partial<UserDto>[];

  @IsOptional()
  channel_messages?: ChannelMessages[];

  @IsOptional()
  banned_users?: BannedUsers[];
}
