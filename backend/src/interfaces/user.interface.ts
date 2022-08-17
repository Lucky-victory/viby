import { DateType } from "./common";

export interface IUser{
    user_id:string;
    username:string;
    fullname: string;
    cover_picture?: string;
    profile_picture?: string;
    status?: string;
    bio?: string;
    password: string;
    friends?: string[];
    email: string;
    created_at: DateType;
}
export type IUserToView = Omit<IUser, 'email' | 'password' | 'friends'>;
export type IUserForToken=Pick<IUser,'fullname'|'user_id'|'username'>