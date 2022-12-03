import { AxiosError, AxiosInstance } from "axios";
import { User } from "../models/User";
import api from './api';
import { Api } from './api'

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
}

export default new UserApi(api);
