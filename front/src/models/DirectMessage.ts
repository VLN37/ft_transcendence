import { User } from './User';

export interface iDirectMessage {
  id: number;
  sender: User;
  receiver: User;
  message: string;
}
