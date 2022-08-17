import { IUser } from "./user.interface";

declare global {
  declare namespace Express {
    interface Request {
      auth: IUser;
    }
  }
}

export type DateType = string | number;
