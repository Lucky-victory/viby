import { DateType } from "./common.interface";

export interface IMessage{
     message_id: string,
      content: string,
      room_id: string,
      attachments:null|string[],
      channel_id:string,
      created_at: DateType ,
      type:MessageType
}

export type MessageType = 'text' | 'audio';