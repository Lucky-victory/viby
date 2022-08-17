import { IUserForToken } from "./../interfaces/user.interface";
import jwt,{SignCallback} from "jsonwebtoken";
import config from "../config";
import omit from "just-omit";
import pick  from "just-pick";

/**
 * utilities class
 */
export class Utils {
  static generateToken(user: IUserForToken,cb:SignCallback) {
    jwt.sign(
      user,
      config.jwt_secret as string,
      cb
    ); 
  }
  static omit<T extends object | object[]>(obj: T, remove: string[]) {
    obj = JSON.parse(JSON.stringify(obj));
    if (Array.isArray(obj)) {
      return obj.map((item) => {
        return omit(item, remove)
      });
    }
  return omit(obj,remove)
  }
  static pick<T extends object>(obj: T|T[], select: (keyof T)[]) {
    obj = JSON.parse(JSON.stringify(obj));
    if (Array.isArray(obj)) {
      return obj.map((item) => {
        return pick(item as T, select)
      });
    }
  return pick(obj,select)
  }
 
}
