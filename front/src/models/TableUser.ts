import { User } from './User';

export interface TableUser {
  login_intra: string;
  id: number;
  tfa_enabled: boolean;
  avatar_path: string;
  nickname: string;
  wins: number;
  losses: number;
  mmr: number;
  status: string;
}

export function TableUser(): TableUser;
export function TableUser(user: User): TableUser;
export function TableUser(user: User | void) {
  return user
    ? {
        login_intra: user.login_intra,
        id: user.id,
        tfa_enabled: user.tfa_enabled,
        avatar_path: user.profile.avatar_path,
        nickname: user.profile.nickname,
        wins: user.profile.wins,
        losses: user.profile.losses,
        mmr: user.profile.mmr,
        status: user.profile.status,
      }
    : {
        login_intra: '',
        id: 0,
        tfa_enabled: false,
        avatar_path: '',
        nickname: '',
        wins: 0,
        losses: 0,
        mmr: 0,
        status: 'OFFLINE',
      };
}
