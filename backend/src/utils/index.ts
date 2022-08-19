import { IUserForToken } from "./../interfaces/user.interface";
import jwt, { SignCallback } from "jsonwebtoken";
import config from "../config";
import omit from "just-omit";
import pick from "just-pick";
// import pluck from "just-pluck-it";
import ShortId from "short-unique-id";
import { v4 as uuidv4 } from "uuid";
import { Request } from "express";
/**
 * utilities class
 */
export default class Utils {
  static generateToken(user: IUserForToken, cb: SignCallback) {
    jwt.sign(
      user,
      config.jwt_secret as string,
      {
        expiresIn: config.jwt_expiration,
      },
      cb
    );
  }
  static omit<T extends object | object[]>(obj: T, remove: string[]) {
    obj = JSON.parse(JSON.stringify(obj));
    if (Array.isArray(obj)) {
      return obj.map((item) => {
        return omit(item, remove);
      });
    }
    return omit(obj, remove);
  }
  static pick<T extends object>(obj: T | T[], select: (keyof T)[]) {
    obj = JSON.parse(JSON.stringify(obj));
    if (Array.isArray(obj)) {
      return obj.map((item) => {
        return pick(item as T, select);
      });
    }
    return pick(obj, select);
  }

  /**
   * converts a string to lowercase
   * @param val
   * @returns
   */
  static lower(val: string) {
    return String(val).toLowerCase().trim();
  }
  static removeSpaces(val: string) {
    return String(val).split(" ").join("").trim();
  }
  static generateUsername(fullname: string) {
    const tempId = new ShortId({ length: 4 });
    const username = Utils.removeSpaces(`${fullname}${tempId()}`);
    return username;
  }
  /**
   * generate a UUID,
   * @param dashes - whether to remove the dash delimiters
   */
  static generateID(dashes = true) {
    return dashes ? uuidv4() : uuidv4().replace(/-/g, "");
  }
  static get currentTime() {
    return new Date();
  }
  /**
   * returns the authenticated user
   * @param req
   * @returns
   */
  static getAuthenticatedUser(req: Request) {
    return req?.auth;
  }
}
