import axios, { Axios, AxiosError, AxiosHeaders } from 'axios';
import { io } from 'socket.io-client';
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
  private readonly MATCH_MAKING_NAMESPACE = 'match-making';

  private client = axios.create({
    baseURL: 'http://localhost:3000',
  });

  private matchMakingSocket = io(
    `http://localhost:3000/${this.MATCH_MAKING_NAMESPACE}`,
  );

  constructor() {
    this.matchMakingSocket.on('connect', () => {
      console.log(
        `${this.MATCH_MAKING_NAMESPACE} socket connected to the server`,
      );
    });
    this.matchMakingSocket.on('disconnect', () => {
      console.log(`connection for socket ${this.MATCH_MAKING_NAMESPACE} lost`);
    });

    const sock = this.matchMakingSocket.connect();
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

  findMatch(type: string): boolean {
    if (this.matchMakingSocket.connected) {
      const msgPayload = {
        message: 'test',
        matchType: type,
      };
      const callback = () => {
        console.log('request for enqueueing sent');
      };

      this.matchMakingSocket.emit('enqueue', msgPayload, callback);
      return true;
    } else {
      throw new Error('Not connected to the server');
    }
  }

  stopFindingMatch() {
    if (this.matchMakingSocket.connected) {
      const callback = () => {
        console.log('request for dequeueing sent');
      };

      this.matchMakingSocket.emit('dequeue', callback);
      return true;
    } else {
      throw new Error('Not connected to the server');
    }
  }

  setToken(token: string) {
    this.client.defaults.headers['Authorization'] = `Bearer ${token}`;
  }

  removeToken() {
    this.client.defaults.headers['Authorization'] = null;
  }
}

export default new Api();
