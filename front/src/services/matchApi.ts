import { io, Socket } from 'socket.io-client';
import userStorage from './userStorage';
import api from './api';

export class MatchApi {
  private readonly MATCH_MANAGER_NAMESPACE = 'match-manager';
  private matchSocket?: Socket;

  constructor() {
    console.log('constructing a match api');
  }

  connectToServer() {
    const url = `http://localhost:3000/${this.MATCH_MANAGER_NAMESPACE}`;
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
}

// export default new MatchApi();
