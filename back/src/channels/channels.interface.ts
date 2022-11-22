import { UserDto } from 'src/users/dto/user.dto';
import { ChannelDto } from './dto/channel.dto';

export interface ChannelRoomAuth {
  room: number;
  password?: string;
}

export interface ChannelRoomMessage {
  message: string;
  channel_id: number;
}

export interface Message {
  id: number;
  message: string;
  user: UserDto;
  channel: ChannelDto;
}
