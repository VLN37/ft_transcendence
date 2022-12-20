import { AxiosError, AxiosInstance } from 'axios';
import { User } from '../models/User';
import api from './api';
import { Api } from './api';

class UserApi {
  private client: AxiosInstance;
  constructor(public _client: Api) {
    console.log('Creating user api class instance');
    this.client = _client.getClient();
  }

  async getUser(id: string): Promise<User> {
    const response = await this.client.get(`/users/${id}`, {});
    return response.data;
  }

  async getMe(): Promise<User> {
    const response = await this.client.get(`/users/me`, {});
    return response.data;
  }

  async getRankedUsers(): Promise<User[]> {
    const response = await this.client.get<User[]>('/users', {
      params: {
        sort: 'mmr',
        order: 'DESC',
      },
    });
    // console.log(response.data);
    return response.data;
  }

  async updateFriendRequest(me: number, target: number, status: string) {
    try {
      const response = await this.client.put(
        `/users/${me}/friend_requests/${target}`,
        {
          status: status,
        },
      );
      return response;
    } catch (err) {
      console.log(err);
      return (err as AxiosError).response;
    }
  }

  async removeFriend(me: number, target: number) {
    try {
      return this.client.delete(`/users/${me}/friends/${target}`);
    } catch (err) {
      return (err as AxiosError).response;
    }
  }

  async acceptFriend(me: number, target: number) {
    try {
      const response = await this.client.put(
        `/users/${me}/friend_requests/${target}`,
        {
          status: 'ACCEPTED',
        },
      );
      return response;
    } catch (err) {
      console.log(err);
      return (err as AxiosError).response;
    }
  }

  async rejectFriend(me: number, target: number) {
    try {
      const response = await this.client.put(
        `/users/${me}/friend_requests/${target}`,
        {
          status: 'DECLINED',
        },
      );
      return response;
    } catch (err) {
      console.log(err);
      return (err as AxiosError).response;
    }
  }
}
export default new UserApi(api);
