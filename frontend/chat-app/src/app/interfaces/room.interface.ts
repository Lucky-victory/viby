import { DateType } from './common.interface';
import { IUserToView } from './user.interface';

export interface IRoom {
  room_id: string;
  channel_id: string;
  title: string;
  created_at: DateType;
  description?: string;
  members?: IUserToView[];
  message_allowed: boolean;
  owner_id: string;
}
export type INewRoom = Pick<IRoom, 'channel_id' | 'description' | 'title'>;
