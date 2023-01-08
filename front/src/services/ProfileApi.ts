import { AxiosError, AxiosInstance } from 'axios';
import { User } from '../models/User';
import api from './api';
import { Api } from './api';

class ProfileApi {
  private client: AxiosInstance;
  constructor(public _client: Api) {
    console.log('Creating profile api class instance');
    this.client = _client.getClient();
  }

  async uploadNickname(user: User, name: string) {
    user.profile.nickname = name;
    try {
      const response = await this.client.patch<any>(`/users/${user.id}`, {
        id: user.id,
        login_intra: user.login_intra,
        profile: {
          ...user.profile,
          nickname: name,
        },
      });
      return response;
    } catch (err) {
      console.log('catch', err);
      return (err as AxiosError).response;
    }
  }

  async uploadAvatar(body: FormData) {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    try {
      const response = await this.client.post<any>('/avatar', body, config);
      // console.log(response);
      return response;
    } catch (err) {
      return (err as AxiosError).response;
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
}

export default new ProfileApi(api);
