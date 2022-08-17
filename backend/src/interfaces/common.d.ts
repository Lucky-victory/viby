import { IUser } from "./user.interface";

declare global {
  declare namespace Express {
    interface Request {
      auth: IUser;
    }
  }
}

export type DateType = string | number;
export interface IResponse<T>{
    data: T | null,
    message?: string;
    
}