import { IUserForToken } from "./user.interface";

declare global {
  declare namespace Express {
    interface Request {
      auth: IUserForToken;
    }
  }
}

export type DateType = string | number | Date | null;
export interface IResponse<T> {
  data: T | null;
  message?: string;
}
