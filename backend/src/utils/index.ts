import { IUser } from "./../interfaces/user.interface";
import jwt from "jsonwebtoken";
import config from "../config";

export class Utils {
  generateToken(user: IUser) {
    jwt.sign(
      user,
      config.jwt_secret as string,
      (error: unknown, encoded: string) => {}
    );
  }

  static isObject(val: unknown) {
    return Object.prototype.toString.call(val) === "[object Object]";
  }
}
