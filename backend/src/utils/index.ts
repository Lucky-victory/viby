import { IUserForToken } from "./../interfaces/user.interface";
import jwt, { SignCallback } from "jsonwebtoken";
import config from "../config";
import omit from "just-omit";
import pick from "just-pick";
import flatten from "just-flatten-it";

import ShortId from "short-unique-id";
import { v4 as uuidv4 } from "uuid";
import { Request } from "express";
import merge from "just-merge";
/**
 * Utilities class
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
  static merge<T extends object,O extends object[],R extends object>(obj:T, ...objs:O):R{
   return merge(obj,...objs) as unknown as R;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static flatten<R>(arr: any): R[] {
    arr = JSON.parse(JSON.stringify(arr));
    return flatten(arr);
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

  /**
   * Merges and Nest an object based on a matched key value
   * @param outer -
   * @param inner
   * @param options -
   * @returns
   */
  static arrayMergeObject<O = object[], I = object[], R = object[]>(
    outer: O,
    inner: I,
    options: Partial<IArrayMergeOptions> = {}
  ): R | [] {
    if (!(Array.isArray(outer) && Array.isArray(inner))) {
      return [];
    }
    const {
      innerTitle = "user",
      outerProp = "user_id",
      innerProp = "user_id",
    } = options;
    const result = outer.map((item) => {
      return {
        ...item,
        [innerTitle]: {
          ...inner.reduce((accum, inItem) => {
            return item[outerProp] === inItem[innerProp] ? inItem : accum;
          }, {}),
        },
      };
    });
    return result as unknown as R;
  }

  /**
   * Merges and Nest an array of objects based on a matched key value
   * @param outer - the main array
   * @param inner - the array to be nested
   * @param options -
   * @returns
   */
  static arrayMerge<O = object[], I = object[], R = object[]>(
    outer: O,
    inner: I,
    options: Partial<IArrayMergeOptions> = {}
  ): R | [] {
    if (!(Array.isArray(outer) && Array.isArray(inner))) {
      return [];
    }

    const {
      innerTitle = "rooms",
      outerProp = "channel_id",
      innerProp = "channel_id",
    } = options;
    const result = outer.map((item) => {
      return {
        ...item,
        [innerTitle]: [
          ...inner.reduce((accum, inItem) => {
            item[outerProp] === inItem[innerProp] ? accum.push(inItem) : accum;
            return accum;
          }, []),
        ],
      };
    });
    return result as unknown as R;
  }
}
interface IArrayMergeOptions {
  outerProp: string;
  innerProp: string;
  innerTitle: string;
}
