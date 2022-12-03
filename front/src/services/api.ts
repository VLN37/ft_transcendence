import axios, { AxiosError } from 'axios';
import { io, Socket } from 'socket.io-client';
import { StatusCodes } from 'http-status-codes';
import { ChannelRoomAuth, ChannelSocketResponse } from '../models/Channel';

interface AuthenticationResponse {
  access_token: string;
  token_type: string;
}

export type ErrorResponse = {
  statusCode: number;
  message?: string;
  error: string;
};

export class Api {
  private readonly MATCH_MAKING_NAMESPACE = 'match-making';
  private readonly CHANNEL_NAMESPACE = 'channel';
  private readonly DM_NAMESPACE = 'direct_messages';

  private client = axios.create({
    baseURL: 'http://localhost:3000',
  });

  private matchMakingSocket?: Socket;
  private channelSocket?: Socket;
  private dmSocket?: Socket;
  private token?: string;

  constructor() {
    console.log('Creating API class instance');
  }

  getClient() {
    return this.client;
  }

  getMatchMakingSocket() {
    return this.matchMakingSocket;
  }

  async addAdmin(targetId: number, channelId: number) {
    try {
      const response = await this.client.post<any>(
        `/channels/${channelId}/admin/${targetId}`,
      );
      return response;
    } catch (err) {
      console.log('catch', err);
      return (err as AxiosError).response;
    }
  }

  getChannelSocket() {
    return this.channelSocket;
  }

  getDirectMessageSocket() {
    return this.dmSocket;
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

  async createChannel(data: any): Promise<any> {
    try {
      const response = await this.client.post('/channels', data);
      return response;
    } catch (error) {
      return (error as AxiosError).response;
    }
  }

  connectToChannel(data: ChannelRoomAuth): Promise<ChannelSocketResponse> {
    return new Promise((resolve) => {
      this.channelSocket = io(
        `http://localhost:3000/${this.CHANNEL_NAMESPACE}`,
        {
          auth: { token: this.token },
        },
      );
      this.channelSocket.emit('join', data, (res: ChannelSocketResponse) => {
        if (res.status == StatusCodes.OK)
          console.log(`Client connected to the room ${data.room}`);
        console.log(res);
        resolve(res);
        return data;
      });
    });
  }

  connectToDM() {
    this.dmSocket = io(`http://localhost:3000/${this.DM_NAMESPACE}`, {
      auth: { token: this.token },
    });
  }

  private connectToMatchMakingCoordinator() {
    const url = `http://localhost:3000/${this.MATCH_MAKING_NAMESPACE}`;
    const options = {
      auth: {
        token: this.token,
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
      console.error('error connecting to the server', err);
    });
  }

  setToken(token: string) {
    this.client.defaults.headers['Authorization'] = `Bearer ${token}`;
    this.token = token;
    this.connectToMatchMakingCoordinator();
    this.connectToDM();
  }

  removeToken() {
    this.client.defaults.headers['Authorization'] = null;
    if (this.matchMakingSocket) this.matchMakingSocket.auth = {};
    this.token = undefined;
    this.channelSocket?.disconnect();
    this.dmSocket?.disconnect();
  }

  getToken() {
    return this.token;
  }
}

export default new Api();
