import { io, Socket } from 'socket.io-client';
import { PlayerCommand } from '../game/model/GameRules';
import { MatchState } from '../game/model/MatchState';
import api from './api';

export class GameApi {
  private readonly MATCH_MANAGER_NAMESPACE = 'match-manager';
  private matchSocket?: Socket;

  private matchId: string;

  constructor(matchId: string) {
    this.matchId = matchId;
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

  connectAsPlayer() {
    if (!this.matchSocket) throw new Error('Not connected to the server');
    this.matchSocket.emit('connect-as-player', {
      match_id: this.matchId,
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

  issueCommand(command: PlayerCommand) {
    if (!this.matchSocket) {
      throw new Error('match socket is not set');
    }
    this.matchSocket.emit('player-command', {
      match_id: this.matchId,
      command: command,
    });
  }

  getGameRules() {
    return api.getClient().get('/matches/rules');
  }
}

// export default new MatchApi();
