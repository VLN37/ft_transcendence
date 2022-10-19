export interface TokenPayload {
  sub: number; // user id
  tfa_enabled: boolean;
  is_authenticated_twice: boolean;
}
