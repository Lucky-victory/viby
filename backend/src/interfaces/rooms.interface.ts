import { DateType } from "./common.d";

export interface IRoom {
  room_id: string;
  channel_id: string;
  title: string;
  created_at: DateType;
  description?: string;
  members: string[];
  message_allowed: boolean;
  owner_id: string;
}
export type INewRoom = Pick<
  IRoom,
  | "message_allowed"
  | "members"
  | "owner_id"
  | "channel_id"
  | "description"
  | "title"
>;
