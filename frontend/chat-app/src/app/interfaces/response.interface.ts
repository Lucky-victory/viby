import { IChannel } from "./channel.interface";

export interface IResponse{
    message?: string;
    status?: number;
    channels: IChannel[];
    
}