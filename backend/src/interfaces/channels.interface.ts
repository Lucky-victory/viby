import { IRoom } from "../interfaces/rooms.interface";
import { DateType } from "./common";

export interface IChannel {
  created_at: DateType;
  title: string;
  description?: string;
  owner_id: string;
  is_public: boolean;
  channel_picture?: string;
  channel_cover?: string;
  channel_id: string;
  members: string[];
  rooms: string[];
}
export type IChannelToView = Omit<IChannel, "members" | "rooms"> & {
  rooms?: IRoom[];
};
