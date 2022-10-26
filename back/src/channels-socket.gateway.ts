import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface Payload {
  id: string;
  name: string;
  text: string;
}

interface Message {
  name: string;
  text: string;
}

@WebSocketGateway({ cors: true })
export class ChannelsSocketGateway {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(ChannelsSocketGateway.name);

  @SubscribeMessage('mensagem')
  handleMessage(client: Socket, data: Message): void {
    this.logger.debug('Received a message from ' + client.id);
    const message: Payload = {
      id: client.id,
      name: data.name,
      text: data.text,
    };
	const message2: Payload = {
		id: client.id,
		name: data.name,
		text: 'roommmmmmmmmmm',
	  };
    this.logger.debug('Sending a message to ' + client.id);
    this.server.emit('mensagem', message);
    // this.server.to(client.id).emit('mensagem', message2);
  }
}

// @WebSocketGateway({ cors: true })
// export class ChannelsSocketGateway implements OnGatewayConnection {
//   @WebSocketServer() server: Server;
//   private readonly logger = new Logger(ChannelsSocketGateway.name);

//   handleConnection(client: Socket, room: string) {
//     client.on(room, function (room) {
//       client.join(room);
//     });
//     this.logger.debug(`Client ${client.id} connected to the room ${room}`);
//   }
// }
