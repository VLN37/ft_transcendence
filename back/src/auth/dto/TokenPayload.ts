export interface TokenPayload {
  sub: number; // user id
  tfa_enabled: boolean;
  is_tf_authenticated: boolean;
}
