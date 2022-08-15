import { DateType } from "./common.interface";
import { IUser } from "./user.interface";

export interface IMessage{
     message_id: string,
      content: string,
      room_id: string,
      attachments:null|string[],
      channel_id:string,
      created_at: DateType ,
      type:MessageType,
    user_id: string;
    user?: IUser
}

export type MessageType = 'text' | 'audio';