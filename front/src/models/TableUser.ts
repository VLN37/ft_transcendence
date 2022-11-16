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
