import { DateType } from "./common.interface";

export interface IRoom{
    room_id:string;
    channel_id: string;
    title:string;
    created_at:DateType
}