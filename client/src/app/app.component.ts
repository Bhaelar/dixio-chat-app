import { Component, ViewChild, ElementRef } from '@angular/core';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private chatService: ChatService) {
    this.chatService.getUsers();
    this.chatService.usersFetched().subscribe((users: any) => {
      this.users = users;
    });

    this.chatService.joinedUser().subscribe((user: any) => {
      if (user.name === this.username) {
        this.loggedIn = true;
        this.currentUser = user;
      }
      this.users.push(user);
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
  loginError: boolean = false;

  joinChat() {
    const { username } = this;
    try {
      const findUser = this.users.filter(
        (user) => user.name.toLowerCase() === username.toLowerCase()
      );
      if (findUser.length > 0) {
        this.loginError = true;
        return;
      }
      this.chatService.joinRoom({ name: username.trim() });
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
    this.scroll.nativeElement.scrollTop =
      this.scroll.nativeElement.scrollHeight;
  }
}
