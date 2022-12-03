import { UserDto } from 'src/users/dto/user.dto';
import { ChannelDto } from './dto/channel.dto';

export interface ChannelRoomAuth {
  room: number;
  password?: string;
}

export interface ChannelRoomMessage {
  channel_id: number;
  message: string;
}

export interface Message {
  id: number;
  message: string;
  user: UserDto;
  channel: ChannelDto;
}
