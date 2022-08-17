import { IUser } from "./../interfaces/user.interface";
import jwt,{SignCallback} from "jsonwebtoken";
import config from "../config";

export class Utils {
  static generateToken(user: IUser,cb:SignCallback) {
    jwt.sign(
      user,
      config.jwt_secret as string,
      cb
    );
  }

  static isObject(val: unknown) {
    return Object.prototype.toString.call(val) === "[object Object]";
  }
}
