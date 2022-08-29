import { DateType } from './common.interface';
import { IUserToView } from './user.interface';

export interface IMessage {
  message_id: string;
  content: string;
  room_id: string;
  attachments: null | string[];
  channel_id: string;
  created_at: DateType;
  type: IMessageType;
  user_id: string;
  user: IUserToView;
  status?: IMessageStatus;
}
export type IMessageStatus = 'edited' | 'sent' | 'error';
export type IMessageToView = Omit<IMessage, 'user_id'>;
export type IMessageToDB = Omit<IMessage, 'user'>;
export type INewMessage = Omit<IMessage, 'user' | 'user_id'>;
export type IMessageType = 'text' | 'audio';
export type MessageInputStatus = 'create' | 'edit';
