import { AxiosError, AxiosInstance } from 'axios';
import { Channel } from '../models/Channel';
import api from './api';
import { Api } from './api';

class ChannelApi {
  private client: AxiosInstance;
  constructor(public _client: Api) {
    console.log('Creating channel api class instance');
    this.client = _client.getClient();
  }

  async updateChannel(
    channel: Channel,
    password: string | null,
    oldPassword: string | null,
  ) {
    try {
      const response = await this.client.patch<any>(`/channels/${channel.id}`, {
        channel: channel,
        newPassword: password,
        oldPassword: oldPassword,
      });
      return response;
    } catch (err) {
      console.log('catch', err);
      return (err as AxiosError).response;
    }
  }

  async getChannel(id: string): Promise<Channel> {
    try {
      const response = await this.client.get<Channel>(`/channels/${id}`, {});
      return response.data;
    } catch (error) {
      return <Channel>{};
    }
  }

  async getChannels(): Promise<Channel[]> {
    try {
      const response = await this.client.get<Channel[]>('/channels', {});
      return response.data;
    } catch (error) {
      return [];
    }
  }

  async banUser(channelId: number, targetId: number, seconds: number) {
    try {
      const response = await this.client.post<any>(
        `/channels/${channelId}/ban/${targetId}`,
        {
          seconds: seconds,
        },
      );
      return response;
    } catch (err) {
      console.log(err);
      return (err as AxiosError).response;
    }
  }

  async unbanUser(channelId: number, targetId: number) {
    try {
      const response = await this.client.delete<any>(
        `/channels/${channelId}/ban/${targetId}`,
      );
      return response;
    } catch (err) {
      console.log(err);
      return (err as AxiosError).response;
    }
  }

  async addFriend(myId: number, targetId: number) {
    try {
      const response = await this.client.post<any>(
        `/users/${targetId}/friend_requests`,
        {
          user_id: myId,
        },
      );
      return response;
    } catch (err) {
      console.log('catch', err);
      return (err as AxiosError).response;
    }
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

  async delAdmin(targetId: number, channelId: number) {
    try {
      const response = await this.client.delete<any>(
        `/channels/${channelId}/admin/${targetId}`,
      );
      return response;
    } catch (err) {
      console.log('catch', err);
      return (err as AxiosError).response;
    }
  }

  async blockUser(myId: number, targetId: number) {
    try {
      const response = await this.client.post<any>(
        `/users/${targetId}/blocked_users`,
        {
          user_id: myId,
        },
      );
      return response;
    } catch (err) {
      console.log('catch', err);
      return (err as AxiosError).response;
    }
  }

  async unblockUser(myId: number, targetId: number) {
    try {
      const response = await this.client.delete<any>(
        `/users/${myId}/blocked_users`,
        {
          data: { user_id: targetId },
        },
      );
      return response;
    } catch (err) {
      console.log('catch', err);
      return (err as AxiosError).response;
    }
  }
}

export default new ChannelApi(api);
