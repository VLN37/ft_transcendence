export interface User {
  login_intra: string;
  id: number;
  tfa_enabled: boolean;
  profile: {
    name: string,
    avatar_path: string;
    nickname: string;
    wins: number;
    losses: number;
  };
}

export function emptyUser(): User {
  return {
    login_intra: '',
    id: 0,
    tfa_enabled: false,
    profile: {
      name: '',
      avatar_path: '',
      nickname: '',
      wins: 0,
      losses: 0,
    }
  }
}
