import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';
import { MessageModel, UserModel } from './chat.interface';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})

export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  // @WebSocketServer() server: Server;
  // users: number = 0;
  // async handleConnection() {
  //   // A client has connected
  //   this.users++;
  //   // Notify connected clients of current users
  //   this.server.emit('users', this.users);
  // }
  // async handleDisconnect() {
  //   // A client has disconnected
  //   this.users--;
  //   // Notify connected clients of current users
  //   this.server.emit('users', this.users);
  // }
  // @SubscribeMessage('chat')
  // async onChat(client, message) {
  //   client.broadcast.emit('chat', message);
  // }

  constructor(private  chatService: ChatService) {}
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatGateway');

  @SubscribeMessage('join')
  joinRoom(client: Socket, payload: UserModel): void {
    const newUser = this.chatService.joinRoom(payload);
    this.logger.log(`Client joined chat: ${client.id}`);
    this.server.emit('userJoined', newUser);
  }

  @SubscribeMessage('getUsers')
  getUsers(client: Socket): void {
    const users = this.chatService.findAllUsers();
    this.logger.log(`Users fetched: ${JSON.stringify(users)}`);
    this.server.emit('users', users);
  }

  @SubscribeMessage('getMessages')
  getMessages(client: Socket): void {
    const messages = this.chatService.findAllMessages();
    this.logger.log(`Messages fetched: ${JSON.stringify(messages)}`);
    this.server.emit('messages', messages);
  }

  @SubscribeMessage('sendMessage')
  sendMessage(client: Socket, payload: MessageModel): void {
    const message = this.chatService.sendMessage(payload);
    this.logger.log(`Message sent: ${JSON.stringify(message)}`);
    this.server.emit('newMessage', message);
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }
}
