import { Channel } from "./Channel";

export interface User {
  login_intra: string;
  id: number;
  tfa_enabled: boolean;
  friends: User[];
  friend_requests: User[];
  blocked: User[];
  channels: Channel[];
  profile: {
    name: string,
    avatar_path: string;
    nickname: string;
    wins: number;
    losses: number;
    status: string;
    mmr: number;
  };
}

export function emptyUser(): User {
  return {
    login_intra: '',
    id: 0,
    tfa_enabled: false,
    friends: [],
    friend_requests: [],
    blocked: [],
    channels: [],
    profile: {
      name: '',
      avatar_path: '',
      nickname: '',
      wins: 0,
      losses: 0,
      status: 'OFFLINE',
      mmr: 0,
    }
  }
}
