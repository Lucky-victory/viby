import { DateType } from './common.interface';

export interface IUser {
  user_id: string;
  username: string;
  fullname: string;
  cover_picture?: string;
  profile_picture?: string;
  status?: IUserStatus;
  bio?: string;
  password: string;
  friends?: string[];
  email: string;
  created_at?: DateType;
}
export type IUserStatus = 'online' | 'away' | 'offline';
export type IUserToView = Omit<IUser, 'email' | 'password' | 'friends'>;
export type IUserForToken = Pick<IUser, 'fullname' | 'user_id' | 'username'>;

export type INewUser = Pick<
  IUser,
  'email' | 'password' | 'fullname' | 'username'
>;

export interface IUserCredentials {
  token: string;
  expires_at: number;
  user: IUserToView;
}
