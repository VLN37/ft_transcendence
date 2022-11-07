import axios, { AxiosError } from 'axios';
import { io, Socket } from 'socket.io-client';

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
  private readonly CHANNEL_NAMESPACE = 'channel';

  private client = axios.create({
    baseURL: 'http://localhost:3000',
  });

  private matchMakingSocket?: Socket;
  private token?: string;

  private channelSocket: Socket;

  constructor() {
    this.channelSocket = io(`http://localhost:3000/${this.CHANNEL_NAMESPACE}`);
    console.log('Creating API class instance');
  }

  async uploadAvatar(body: FormData) {
    // console.log('upload: ', body);
    // console.log('upload: ', body.get('avatar'));
    // const stuff = { avatar: body.get('avatar') };
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    const response = await this.client
      .post<any>('/profile/avatar', body)
      .catch((error: AxiosError) => {
        return error.response;
      });
    console.log(response);
    return response;
  }

  connectToChannel(room: string) {
    this.channelSocket.emit('join', room);
    console.log(`Client connected to the room ${room}`);
  }

  sendMessage(data: any) {
    this.channelSocket.emit('chat', data);
  }

  listenMessage(callback: any) {
    this.channelSocket.on('chat', callback);
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

  async getUser(id: string): Promise<User> {
    const response = await this.client.get(`/users/${id}`, {});
    return response.data;
  }

  findMatch(type: 'CLASSIC' | 'TURBO', onResponse: Function) {
    const url = `http://localhost:3000/${this.MATCH_MAKING_NAMESPACE}`;
    const options = {
      auth: {
        token: this.token,
      },
      query: {
        type: type,
      },
    };

    this.matchMakingSocket = io(url, options);

    this.matchMakingSocket.on('connect', () => {
      console.log(
        `${this.MATCH_MAKING_NAMESPACE} socket connected to the server`,
      );
    });

    this.matchMakingSocket.on('disconnect', () => {
      console.log(`connection for socket ${this.MATCH_MAKING_NAMESPACE} lost`);
    });

    this.matchMakingSocket.on('connect_error', (err) => {
      console.error(err);
    });

    this.matchMakingSocket.on('match-found', (matchData) => {
      console.log(matchData);
    });

    // this.matchMakingSocket.connect();
  }

  stopFindingMatch() {
    if (this.matchMakingSocket?.connected) {
      this.matchMakingSocket.disconnect();
    }
  }

  setToken(token: string) {
    this.client.defaults.headers['Authorization'] = `Bearer ${token}`;
    this.token = token;
    // this.matchMakingSocket.connect();
  }

  removeToken() {
    this.client.defaults.headers['Authorization'] = null;
    if (this.matchMakingSocket) this.matchMakingSocket.auth = {};
    this.token = undefined;
  }
}

export default new Api();
