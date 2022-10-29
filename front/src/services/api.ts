import axios, { Axios, AxiosError, AxiosHeaders } from 'axios';
import { Channel } from '../models/Channel';
import { User } from '../models/User';

interface AuthenticationResponse {
  access_token: string;
  token_type: string;
}

export type ErrorResponse = {
  statusCode: number;
  message?: string;
  error: string;
};

class Api {
  private client = axios.create({
    baseURL: 'http://localhost:3000',
  });

  constructor() {
    console.log('Criando uma instancia da classe de API');
  }

  async getAvatar(): Promise<string> {
    const response = await this.client.get('/users/me', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('selfkey'),
      },
    });
    console.log(response.data);
    return response.data.profile.avatar_path;
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
    const response = await this.client.get<User[]>('/users', {
      params: {
        sort: 'mmr',
        order: 'DESC',
      },
    });
    console.log(response.data);
    return response.data;
  }

  async getChannels(): Promise<Channel[]> {
    const response = await this.client.get<Channel[]>('/channels', {});
    console.log(response.data);
    return response.data;
  }

  async findMatch(type: string): Promise<boolean | ErrorResponse> {
    return this.client
      .post('/match-making', {
        type,
      })
      .then((response) => {
        return response.data;
      })
      .catch((error: Error | AxiosError) => {
        if (axios.isAxiosError(error)) {
          return error.response?.data;
        }
        return error;
      });
  }

  setToken(token: string) {
    this.client.defaults.headers['Authorization'] = `Bearer ${token}`;
  }

  removeToken() {
    this.client.defaults.headers['Authorization'] = null;
  }
}

export default new Api();
