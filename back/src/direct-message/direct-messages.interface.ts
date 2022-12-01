import { UserDto } from 'src/users/dto/user.dto';

export interface UserMessage {
  user_id: string;
  message: string;
}

export interface iDirectMessage {
  id: number;
  sender: UserDto;
  receiver: UserDto;
  message: string;
}
