import { AxiosError, AxiosInstance } from 'axios';
import { Socket } from 'socket.io-client';
import { User } from '../models/User';
import api from './api';
import { Api } from './api';

class MMApi {
  private matchMakingSocket?: Socket;
  private client: AxiosInstance;
  constructor(public _client: Api) {
    // console.log('Creating matchmaking api class instance');
    this.matchMakingSocket = _client.getMatchMakingSocket();
    this.client = _client.getClient();
  }

  setMatchMakingSocket(instance: Api) {
    this.matchMakingSocket = instance.getMatchMakingSocket();
  }

  async sendGameRequest(user: User, recipient: number) {
    try {
      const response = await this.client.post(
        `/matches/friendly/${recipient}`,
        {
          user: user,
        },
      );
      return response;
    } catch (err) {
      //   console.log(err);
      return (err as AxiosError).response;
    }
  }

  async updateGameRequest(status: string, user1: User, user2: User) {
    try {
      const response = await this.client.put(`/matches/friendly`, {
        status: status,
        user1: user1,
        user2: user2,
      });
      return response;
    } catch (err) {
      // console.log(err);
      return (err as AxiosError).response;
    }
  }

  findMatch(
    type: 'CLASSIC' | 'TURBO',
    onMatchFound: Function,
    onError?: Function,
  ) {
    // console.log('match type: ' + type);

    const matchFound = 'match-found';
    const error = 'match-error';
    this.matchMakingSocket?.once(matchFound, () => {
      // console.log('match found');
      this.matchMakingSocket?.removeAllListeners(matchFound);
      this.matchMakingSocket?.removeAllListeners(error);
      onMatchFound();
    });

    this.matchMakingSocket?.once(error, (matchData) => {
      // console.log('match error', matchData);
      this.matchMakingSocket?.removeAllListeners(matchFound);
      this.matchMakingSocket?.removeAllListeners(error);
      onError?.call(matchData);
    });
      this.matchMakingSocket?.emit('enqueue', { type });
  }

  acceptMatch() {
    this.matchMakingSocket?.emit('accept');
  }

  declineMatch() {
    this.matchMakingSocket?.emit('decline');
  }

  setMatchCreatedSubscriber(callback: (matchId: string) => void) {
    this.matchMakingSocket?.on('match-created', (data) => {
      callback(data.id);
    });
  }

  setMatchMakingUpdateSubscriber(callback: (state: string) => void) {
    this.matchMakingSocket?.on('match-making-update', (state) => {
      callback(state);
    });
  }

  subscribeMatchMakingError(callback: (data: any) => void) {
    this.matchMakingSocket?.on('mm-failed', (data: any) => {
      callback(data);
    });
  }

  unsubscribeMatchMakingError() {
    this.matchMakingSocket?.off('mm-failed');
  }

  unsubscribeMatchCreated() {
    this.matchMakingSocket?.removeAllListeners('match-created');
  }

  unsubscribeMatchMakingUpdate() {
    this.matchMakingSocket?.removeAllListeners('match-making-update');
  }

  stopFindingMatch() {
    if (this.matchMakingSocket?.connected) {
      // console.log('dequeueing user');
      this.matchMakingSocket.emit('dequeue');
    }
  }
}

export default new MMApi(api);
