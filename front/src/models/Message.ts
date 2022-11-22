import { Channel } from "./Channel";
import { User } from "./User";

export interface Message {
  id: number;
  message: string;
  user: User;
  channel: Channel;
}
