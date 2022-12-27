import { User } from './User';

export interface Channel {
  id: number;
  name: string;
  owner_id: number;
  password?: string;
  type: string;
  allowed_users: User[];
  admins: User[];
  users: User[];
  banned_users: any[];
}

export interface ChannelSocketResponse {
  status: number;
  message: string;
}

export interface ChannelRoomAuth {
  room: number;
  password?: string;
}
