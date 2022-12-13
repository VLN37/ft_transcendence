import { UserDto } from 'src/users/dto/user.dto';

export interface UserMessage {
  user_id: string;
  message: string;
}

export interface iFriendRequestWsPayload {
  user: UserDto;
}

export interface iDirectMessage {
  id: number;
  sender: UserDto;
  receiver: UserDto;
  message: string;
}

export interface iDirectLastMessage {
  id: number;
  message: string;
  subject: UserDto;
}
