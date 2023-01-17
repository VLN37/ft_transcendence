import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/users.service';
import { validateWsJwt } from 'src/utils/functions/validateWsConnection';
import { PlayerSide } from './game/model/Paddle';
import { MatchManager } from './match-manager';
import { PlayerCommand } from './model/PlayerCommands';
import { PowerUp } from './model/PowerUps/PowerUp';

const prod = process.env.ENVIRONMENT == 'prod';

@WebSocketGateway({
  namespace: prod ? 'back/match-manager' : 'match-manager',
  cors: {
    origin: '*',
  },
})
export class MatchManagerGateway implements OnGatewayInit, OnGatewayDisconnect {
  private readonly logger = new Logger(MatchManagerGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private matchManager: MatchManager,
  ) {}

  afterInit(server: any) {
    this.logger.debug('match-manager gateway afterInit');
    this.server.use((socket, next) => {
      validateWsJwt(this.usersService, this.jwtService, socket)
        .then((user) => {
          this.logger.debug('user validated');
          socket.handshake.auth['user'] = user;

          next();
        })
        .catch((err) => {
          return next(new Error(err));
        });
    });
  }

  @SubscribeMessage('connect-as-player')
  async connectAsPlayer(
    @MessageBody('match_id') matchId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.handshake.auth.user;
    const playerId = user.id;
    try {
      this.logger.debug('match id: ', matchId);
      this.matchManager.connectPlayer(matchId, playerId);
      this.setupMatchListeners(matchId);
      client.join(matchId);
    } catch (e) {
      this.logger.warn('error connecting player', e);
      throw new WsException(e);
    }
  }

  @SubscribeMessage('refuse-match')
  async refuseMatch(
    @MessageBody('match_id') matchId: string,
    @ConnectedSocket() client: Socket,
  ) {}

  @SubscribeMessage('connect-as-spectator')
  async connectAsSpectator(
    @MessageBody('match_id') matchId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.handshake.auth.user;
    this.logger.debug(`connecting user ${user.login_intra} as spectator`);
    client.join(matchId);
  }

  @SubscribeMessage('player-command')
  async handlePlayerCommand(
    @MessageBody('match_id') matchId: string,
    @MessageBody('command') command: PlayerCommand,
    @ConnectedSocket() client: Socket,
  ) {
    const user: UserDto = client.handshake.auth['user'];
    const result = this.matchManager.handlePlayerCommand(
      user.id,
      command,
      matchId,
    );

    if (result.ok) {
      this.server.in(matchId).emit('match-tick', result.val);
    } else {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    try {
      const user: UserDto = client.handshake.auth['user'];
      this.logger.warn(`player ${user.login_intra} disconnected`);
      this.matchManager.disconnectPlayer(user.id);
    } catch (e) {
      this.logger.error('error disconnecting player', e);
    }
  }

  private setupMatchListeners(matchId: string) {
    this.matchManager.setMatchTickHandler(matchId, (matchState) => {
      this.server.in(matchId).emit('match-tick', matchState);
    });
    this.matchManager.setPowerUpSpawnSubscriber(matchId, (powerup: PowerUp) => {
      this.server.in(matchId).emit('powerup-spawn', powerup);
    });

    type PowerUpCollectedPayload = {
      powerup: PowerUp;
      playerSide: PlayerSide;
    };

    this.matchManager.setPowerUpCollectedSubscriber(
      matchId,
      (side, powerup) => {
        const payload: PowerUpCollectedPayload = {
          powerup,
          playerSide: side,
        };
        this.server.in(matchId).emit('powerup-collected', payload);
      },
    );
  }
}
