import { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessagesGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('newMessage')
  onNewMessage(@MessageBody() body) {
    this.server.emit('onMessage', {
      message: 'A new message has arrived',
      body: body,
    });
  }

  onModuleInit() {
    this.server.on('connection', (socket) => {
      this.onNewMessage({
        body: {
          message: `${socket.id} has connected to the server`,
        },
      });
    });
  }
}
