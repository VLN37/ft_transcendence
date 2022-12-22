import axios, { AxiosError } from 'axios';
import { io, Socket } from 'socket.io-client';
import { StatusCodes } from 'http-status-codes';
import { ChannelRoomAuth, ChannelSocketResponse } from '../models/Channel';
import { v4 as uuidV4 } from 'uuid';
import { chatApi } from './api_index';

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
    baseURL: process.env.REACT_APP_BACK_HOSTNAME,
  });

  private matchMakingSocket?: Socket;
  private channelSocket?: Socket;
  private dmSocket?: Socket;
  private token?: string;

  constructor() {
    console.log('Creating API class instance');
    this.client.interceptors.request.use((config) => {
      if (config.headers) config.headers['x-correlation-id'] = uuidV4();
      return config;
    });
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

  async get2faQRcode() {
    const response = await this.client.get('/auth/2fa');
    if (response.status != 200)
      throw new Error('2fa code generation failed');
    return response.data;
  }

  async toggle2fa(tfaCode: string, state: 'ENABLED' | 'DISABLED') {
    try {
      const response = await this.client.put<AuthenticationResponse>(
        '/auth/2fa',
        {
          tfa_code: tfaCode,
          state: state,
        },
      );
      return response;

    } catch(err) {
      console.log(err);
      return (err as AxiosError).response;
    }
  }

  async authenticate2fa(tfaCode: string): Promise<any> {
    try {
      const response = await this.client.post<AuthenticationResponse>(
        '/auth/2fa',
        {
          tfa_code: tfaCode,
        },
      );
      return response;

    } catch(err) {
      console.log(err);
      return (err as AxiosError).response;
    }
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
        `${process.env.REACT_APP_BACK_HOSTNAME}/${this.CHANNEL_NAMESPACE}`,
        {
          auth: { token: this.token },
        },
      );
      this.channelSocket.emit('join', data, (res: ChannelSocketResponse) => {
        if (res.status == StatusCodes.OK)
          console.log(`Client connected to the room ${data.room}`);
        // console.log(res);
        resolve(res);
        return data;
      });
    });
  }

  connectToDM() {
    this.dmSocket = io(
      `${process.env.REACT_APP_BACK_HOSTNAME}/${this.DM_NAMESPACE}`,
      {
        auth: { token: this.token },
      },
    );
  }

  private connectToMatchMakingCoordinator() {
    const url = `${process.env.REACT_APP_BACK_HOSTNAME}/${this.MATCH_MAKING_NAMESPACE}`;
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
    localStorage.setItem('jwt-token', token);
    this.connectToMatchMakingCoordinator();
    this.connectToDM();
  }

  removeToken() {
    this.client.defaults.headers['Authorization'] = null;
    if (this.matchMakingSocket) this.matchMakingSocket.auth = {};
    this.token = undefined;
    this.channelSocket?.disconnect();
    this.dmSocket?.disconnect();
	this.matchMakingSocket?.disconnect();
	chatApi.disconnect();
  }

  getToken() {
    return localStorage.getItem('jwt-token');
  }
}

export default new Api();
