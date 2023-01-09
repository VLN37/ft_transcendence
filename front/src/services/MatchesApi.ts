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
    try {
      const response = await this.client.get(`/matches/live/${qty}`, {});
      return response.data;
    } catch (error) {
      return [];
    }
  }

  async getUserMatches(id: number, qty: number = 0): Promise<Match[]> {
    const query =
      qty ? `/matches/user/${id}?qty=${qty}` : `/matches/user/${id}`;
    try {
      const response = await this.client.get(query, {});
      return response.data;
    } catch (error) {
      return [];
    }
  }
}

export default new MatchesApi(api);
