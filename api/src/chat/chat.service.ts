import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { UserModel, MessageModel } from './chat.interface';

@Injectable()
export class ChatService {
    private users: Array<UserModel> = [
        {
            id: 1,
            name: 'Brad'
        },
        {
            id: 2,
            name: 'Joe'
        },
        {
            id: 3,
            name: 'Tracy'
        },
    ];
    private messages: Array<MessageModel> = [
        {
            id: 1,
            senderId: 1,
            messageContent: "What a lovely day"
        },
        {
            id: 2,
            senderId: 2,
            messageContent: "Did you see the game last night, Brad?"
        },
        {
            id: 3,
            senderId: 1,
            messageContent: "Yeah I did. Really glad we won"
        },
        {
            id: 4,
            senderId: 3,
            messageContent: "Boys!!! Get to your chores now"
        },
    ];

    public findAllUsers(): Array<UserModel> {
        return this.users;
    }

    public findAllMessages(): Array<MessageModel> {
        return this.messages;
    }


    public joinRoom(user: UserModel): UserModel {
        const userExists: boolean = this.users.some(
            (loggedUser) => loggedUser.name === user.name,
        );
        if (userExists) {
            throw new UnprocessableEntityException('User already exists.');
        }

        const maxId: number = Math.max(...this.users.map((item) => item.id), 0);
        const id: number = maxId + 1;

        const newUser: UserModel = {
            ...user,
            id
        };

        this.users.push(newUser)

        return newUser;
    }

    public sendMessage(message: MessageModel): MessageModel {
        const maxId: number = Math.max(...this.messages.map((item) => item.id), 0);
        const id: number = maxId + 1;

        const newMessage: MessageModel = {
            ...message,
            id
        };

        this.messages.push(newMessage);

        return newMessage;
    }
}
