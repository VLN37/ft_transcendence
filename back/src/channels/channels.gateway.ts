import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: '/channel',
  cors: {
    origin: '*',
  },
})
export class ChannelsSocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(ChannelsSocketGateway.name);

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleConnection(client: any) {
    this.logger.log(`Client connected ${client.id}`);
  }

  handleDisconnect(client: any) {
    this.logger.log(`Client disconnected ${client.id}`);
  }

  @SubscribeMessage('join')
  handleJoin(client: Socket, room: string): void {
    client.join(room);
	console.log(`Client connected to the room ${room}`);
  }

  @SubscribeMessage('chat')
  handleMessage(client: Socket, data): void {
    this.logger.debug('Received a message from ' + client.id);
    this.logger.debug('Sending a message to ' + client.id);
    this.server.to(data.room).emit('chat', data);
  }
}
