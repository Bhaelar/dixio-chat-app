import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private socket: Socket) {
  }
  getUsers() {
    return this.socket.emit('getUsers');
  }
  usersFetched() {
    return this.socket.fromEvent('users');
  }
  joinRoom(user: { name: string }) {
    return this.socket.emit('join', user)
  }
  joinedUser() {
    return this.socket.fromEvent('userJoined');
  }
  getMessages() {
    return this.socket.emit('getMessages');
  }
  messagesFetched() {
    return this.socket.fromEvent('messages');
  }
  sendMessage(message: {
    id?: number,
    senderId: number,
    messageContent: string
  }) {
    return this.socket.emit('sendMessage', message)
  }
  newMessage() {
    return this.socket.fromEvent('newMessage');
  }
}