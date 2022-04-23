import { Component, ViewChild, ElementRef } from '@angular/core';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private chatService: ChatService) {
    this.chatService.joinedUser().subscribe((user: any) => {
      if (this.username === user[user.length - 1].name) {
        this.currentUser = user[user.length - 1];
        this.loggedIn = true;
      }

      this.users = user;
    });

    this.chatService.messagesFetched().subscribe((messages: any) => {
      this.messages = messages;
    });

    this.chatService.newMessage().subscribe((message: any) => {
      this.messages.push(message);
    });
  }

  @ViewChild('scroll', { read: ElementRef }) public scroll: ElementRef<any>;

  username = '';
  loggedIn = false;
  users: Array<{ id?: number; name: string }> = [];
  currentUser: { id: number; name: string } = { name: '', id: 0 };
  message: {
    id?: number;
    senderId: number;
    messageContent: string;
  } = {
    senderId: 0,
    messageContent: '',
  };
  newMessage = '';
  messages: Array<{
    id?: number;
    senderId: number;
    messageContent: string;
  }> = [];

  joinChat() {
    const { username } = this;
    try {
      this.chatService.joinRoom({ name: username });
      this.getMessages();
    } catch (err) {
      console.log(err);
      return;
    }
  }

  getUserById(id: number) {
    const user = this.users.filter((item) => item.id === id);
    return user[0].name;
  }

  getMessages() {
    this.chatService.getMessages();
  }

  sendMessage(senderId: number) {
    if (this.newMessage.trim() === '') {
      return;
    }

    this.message = {
      ...this.message,
      senderId,
      messageContent: this.newMessage,
    };
    this.chatService.sendMessage(this.message);
    this.newMessage = '';
    this.goToBottom();
  }

  goToBottom() {
    this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight;
  }
}
