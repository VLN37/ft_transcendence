export interface ToggleTFAPayload {
  tfa_code: string;
  state: 'ENABLED' | 'DISABLED';
}
