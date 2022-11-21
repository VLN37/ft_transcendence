export interface ChannelRoomAuth {
  room: number;
  password?: string;
}

export interface Message {
  id: string;
  name: string;
  text: string;
  room: string;
  avatar: string;
}
