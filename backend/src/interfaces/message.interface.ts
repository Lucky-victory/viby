import { IUser } from "./user.interface";
import { DateType } from "./common";

export interface IMessage {
  message_id: string;
  content: string;
  room_id: string;
  attachments: null | string[];
  channel_id: string;
  created_at: DateType;
  type: MessageType;
  user_id: string;
  user: IUser;
}
export type IMessageToView = Omit<IMessage, "user_id">;
export type IMessageToDB = Omit<IMessage, "user">;
export type MessageType = "text" | "audio";
