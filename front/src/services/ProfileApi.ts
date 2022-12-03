import { AxiosError, AxiosInstance } from "axios";
import { User } from "../models/User";
import { Api, api } from "./api_index";

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
          id: user.id,
          name: user.profile.name,
          nickname: name,
          avatar_path: user.profile.avatar_path,
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
      const response = await this.client.post<any>(
        '/profile/avatar',
        body,
        config,
      );
      // console.log(response);
      return response;
    } catch (err) {
      return (err as AxiosError).response;
    }
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
