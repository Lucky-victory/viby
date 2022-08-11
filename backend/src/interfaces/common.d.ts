
declare global{
    declare namespace Express{
        auth:AuthUser
    }
}

export interface AuthUser{
    user_id:string;
    username:string;
    fullname:string;
}