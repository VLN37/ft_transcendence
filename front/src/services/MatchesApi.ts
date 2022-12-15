import { AxiosInstance } from 'axios';
import { Match } from '../models/Match';
import { emptyUser } from '../models/User';
import api from './api';
import { Api } from './api';
import userStorage from './userStorage';

class MatchesApi {
  private client: AxiosInstance;
  constructor(public _client: Api) {
    console.log('Creating MatchesApi api class instance');
    this.client = _client.getClient();
  }

  getLastMatches(max: number): Promise<Match[]> {
    return new Promise((resolve) => {
      const matches: Match[] = [];
      for (let index = 1; index <= max; index++) {
        const match: Match = {
          id: index.toString(),
          left_player: userStorage.getUser() || emptyUser(),
          right_player: userStorage.getUser() || emptyUser(),
          left_player_score: 100,
          right_player_score: 100,
          stage: index < 5 ? 'ONGOING' : 'FINISHED',
          created_at: new Date(),
          type: index < 5 ? 'NORMAL' : 'TURBO',
        };
        matches.push(match);
      }
      resolve(matches);
    });
  }
}

export default new MatchesApi(api);
