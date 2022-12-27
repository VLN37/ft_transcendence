import { AxiosError, AxiosInstance } from 'axios';
import { emptyUser, User } from '../models/User';
import api from './api';
import { Api } from './api';

class UserApi {
  private client: AxiosInstance;
  constructor(public _client: Api) {
    console.log('Creating user api class instance');
    this.client = _client.getClient();
  }

  async getUser(id: string): Promise<User> {
    try {
      const response = await this.client.get(`/users/${id}`, {});
      return response.data;
    } catch (error) {
      return emptyUser();
    }
  }

  async getMe(): Promise<User> {
    try {
      const response = await this.client.get(`/users/v2/me`, {});
      return response.data;
    } catch (error) {
      return emptyUser();
    }
  }

  async getRankedUsers(): Promise<User[]> {
    try {
      const response = await this.client.get<User[]>('/users', {
        params: {
          sort: 'mmr',
          order: 'DESC',
        },
      });
      return response.data;
    } catch (error) {
      return [];
    }
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
