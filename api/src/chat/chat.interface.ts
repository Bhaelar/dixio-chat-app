export interface UserModel {
  id?: number;
  name: string;
}

export interface MessageModel {
  id?: number;
  senderId: number;
  messageContent: string;
}
