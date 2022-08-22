import { DateType } from './common.interface';
import { IRoom } from './room.interface';

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
  rooms: [];
}
export type IChannelToView = Omit<IChannel, 'members' | 'rooms'> & {
  rooms?: IRoom[];
};
export type INewChannel = Omit<
  IChannel,
  'owner_id' | 'rooms' | 'members' | 'channel_id' | 'created_at'
>;
