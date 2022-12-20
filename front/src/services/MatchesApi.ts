import { AxiosInstance } from 'axios';
import { Match } from '../models/Match';
import api from './api';
import { Api } from './api';

class MatchesApi {
  private client: AxiosInstance;
  constructor(public _client: Api) {
    console.log('Creating MatchesApi api class instance');
    this.client = _client.getClient();
  }

  async getLiveMatches(qty: number): Promise<Match[]> {
    const response = await this.client.get(`/matches/live/${qty}`, {});
    return response.data;
  }

  async getUserMatches(qty: number): Promise<Match[]> {
    const response = await this.client.get(`/matches/user/${qty}`, {});
    return response.data;
  }
}

export default new MatchesApi(api);
