import axios, { AxiosHeaders } from 'axios';
import { User } from '../models/User';

interface AuthenticationResponse {
  access_token: string;
  token_type: string;
}

class Api {
  private client = axios.create({
    baseURL: 'http://localhost:3000',
  });

  constructor() {
    console.log('Criando uma instancia da classe de API');
  }

  async authenticate(code: string): Promise<string> {
    const response = await this.client.post<AuthenticationResponse>(
      '/auth/login',
      {
        code,
      },
    );

    if (response.status != 201) {
      throw new Error('Authentication failed');
    }

    return response.data.access_token;
  }

  async authenticate2fa(tfaCode: string): Promise<string> {
    const response = await this.client.post<AuthenticationResponse>(
      '/auth/2fa',
      {
        tfa_code: tfaCode,
      },
    );

    if (response.status != 201) {
      throw new Error('2FA authentication failed');
    }

    return response.data.access_token;
  }

  async getRankedUsers(): Promise<User[]> {
    // const response = await fetch(URL, {
    //   method: 'GET',
    // });
    // console.log(response.body);
    // return response.json();
    const response = await this.client.get<User[]>('/users');
    console.log(response.data);
    return response.data;
  }

  setToken(token: string) {
    this.client.defaults.headers['Authorization'] = `Bearer ${token}`;
  }

  removeToken() {
    this.client.defaults.headers['Authorization'] = null;
  }
}

export default new Api();
