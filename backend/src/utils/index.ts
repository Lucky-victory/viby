import { IUserForToken } from "./../interfaces/user.interface";
import jwt, { SignCallback } from "jsonwebtoken";
import config from "../config";
import omit from "just-omit";
import pick from "just-pick";
import flatten from "just-flatten-it";
import { UploadApiResponse, v2 as cloudinary} from 'cloudinary';
import { v4 as uuid } from 'uuid';
import ShortId from "short-unique-id";
import { v4 as uuidv4 } from "uuid";
import { Request } from "express";
import merge from "just-merge";

import streamifier from 'streamifier';
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

    return flatten(arr);
  }
  static omit<T extends object>(obj: T|T[], remove: (keyof T)[]|string[]) {

    if (Array.isArray(obj)) {
      return obj.map((item) => {
        return omit(item , remove as (keyof T)[]);
      });
    }
    return omit(obj, remove as (keyof T)[]);
  }
  static pick<T extends object>(obj: T | T[], select: (keyof T)[]|string[]) {

    if (Array.isArray(obj)) {
      return obj.map((item) => {
        return pick(item as T, select as (keyof T)[]);
      });
    }
    return pick(obj, select as (keyof T)[]);
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

  static async audioUploadToCloudinary(file:Buffer,id:string=uuid()):Promise<UploadApiResponse> {

    return new Promise((resolve, reject) => {
      
      const cldUploadStream = cloudinary.uploader.upload_stream({
      public_id:'audio_'+id,
        resource_type:'raw',
      }, (error, result) => {
       
         if (result) return resolve(result);
         else return reject(error);
      });
    
    
      streamifier.createReadStream(file).pipe(cldUploadStream)
    })
  }
  static photoUploadToCloudinary(options:ImagePresetOptions={public_id:`${uuid()}`}) {
    return cloudinary.uploader.upload_stream(options as ImagePresetOptions, (err, result) => {

    });
    
    
    // return result;
  }
}


interface IArrayMergeOptions {
  outerProp: string;
  innerProp: string;
  innerTitle: string;
}
interface ImagePresetOptions{
  width?: number;
  height?: number,
  crop?: 'fill' | 'fit',
  gravity?: 'faces' | string;
  radius?: 'max' | string;
  public_id: string;
}
