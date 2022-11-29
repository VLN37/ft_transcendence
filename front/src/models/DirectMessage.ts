import { User } from './User';

export interface iDirectMessage {
  id: number;
  message: string;
  user: User;
}
