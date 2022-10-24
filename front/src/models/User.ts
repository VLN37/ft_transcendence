export interface User {
  login_intra: string;
  id: number;
  tfa_enabled: boolean;
  profile: {
    avatar_path: string;
    nickname: string;
    wins: number;
    losses: number;
  };
}
