import { io, Socket } from 'socket.io-client';
import { MatchState } from '../game/model/MatchState';
import api from './api';

export class MatchApi {
  private readonly MATCH_MANAGER_NAMESPACE = 'match-manager';
  private matchSocket?: Socket;

  constructor() {
    console.log('constructing a match api');
  }

  connectToServer() {
    const url = `${process.env.REACT_APP_BACK_HOSTNAME}/${this.MATCH_MANAGER_NAMESPACE}`;
    const options = {
      auth: {
        token: api.getToken(),
      },
    };
    this.matchSocket = io(url, options);
    this.matchSocket.on('connect', () => {
      console.log(
        `${this.MATCH_MANAGER_NAMESPACE} socket connected to the server`,
      );
    });

    this.matchSocket.on('disconnect', () => {
      console.log(`connection for socket ${this.MATCH_MANAGER_NAMESPACE} lost`);
    });

    this.matchSocket.on('connect_error', (err) => {
      console.error('error connecting to the server', err);
    });
  }

  connectAsPlayer(matchId: string) {
    if (!this.matchSocket) throw new Error('Not connected to the server');
    this.matchSocket.emit('connect-as-player', {
      match_id: matchId,
    });
  }

  setOnMatchTickListener(callback: (state: MatchState) => void) {
    if (!this.matchSocket) {
      throw new Error('match socket is not set');
    }
    this.matchSocket?.on('match-tick', (matchData) => {
      callback(matchData);
    });
  }

  getGameRules() {
    return api.getClient().get('/matches/rules');
  }
}

// export default new MatchApi();
