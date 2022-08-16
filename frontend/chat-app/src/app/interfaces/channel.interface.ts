import { IRoom } from "./room.interface";
import { IUser } from "./user.interface";


export interface IChannel{
    created_at:string;
    owner_id: string;
    is_owner?: boolean;
    title:string;
    description?: string;
    is_public: boolean;
    channel_picture: string;
    channel_cover?: string;
    members:IUser[],
    channel_id: string;
}
export interface IChannelToDB{
    created_at:string;
    owner_id: string;
    is_owner?: boolean;
    title:string;
    description?: string;
    is_public: boolean;
    channel_picture: string;
    channel_cover?: string;
    members: string[];
    rooms: [];
    channel_id: string;
}
export type INewChannel = Partial<IChannel>;
