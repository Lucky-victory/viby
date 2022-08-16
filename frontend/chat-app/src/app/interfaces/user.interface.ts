export interface IUser{
    user_id:string;
    username:string;
    fullname: string;
    cover_picture: string;
    profile_picture:string;
}

export interface INewUser{
    email:string;
    password:string;
    username:string;
    fullname: string;
    
}

export interface IUserCredentials{
    token: string;
    expires_at: number;
    user:IUser
}