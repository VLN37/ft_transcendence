import { User } from './User';

export interface Channel {
  id: number;
  name: string;
  owner_id: number;
  type: string;
  allowed_users?: User[];
  administrators?: User[];
  users: User[];
}

export interface ChannelSocketResponse {
  status: number;
  message: string;
}

export interface ChannelRoomAuth {
  room: number;
  password?: string;
}
