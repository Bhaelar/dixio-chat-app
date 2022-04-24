
import { Controller, Get, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';
import { UserModel, MessageModel } from './chat.interface';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {
    }

    @Get('/users')
    public findAllUsers(): Array<UserModel> {
        return this.chatService.findAllUsers();
    }

    @Get()
    public findAllMessages(): Array<MessageModel> {
        return this.chatService.findAllMessages();
    }

    @Post('/users')
    public joinRoom(@Body() user: UserModel): UserModel {
       return this.chatService.joinRoom(user);
    }

    @Post('')
    public sendMessage(@Body() message: MessageModel): MessageModel {
        return this.chatService.sendMessage(message);
    }
}