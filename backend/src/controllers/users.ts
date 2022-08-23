import Utils from "./../utils/index";
import { Request, Response } from "express";
import { UsersEntity, UsersRepo } from "../models/users";
import ms from "ms";
import config from "../config";
import bcrypt from "bcrypt";
import md5 from "md5";
import {
  IUser,
  IUserForToken,
  IUserToView,
} from "../interfaces/user.interface";
import { EntityData } from "redis-om";
import ChannelsController from "./channels";

export default class UsersController {
  static async createNewUser(req: Request, res: Response) {
    try {
      const currentTime = Utils.currentTime;

      let { email } = req.body;
      const { fullname } = req.body;
      // the username to be used if no username was supplied in the request
      const defaultUsername = Utils.generateUsername(fullname);
      const { username = defaultUsername, password } = req.body;
      // convert the email address to lowercase,
      email = Utils.lower(email);
      // hash the email to fetch user's avatar from gravatar
      const emailHash = md5(email);

      // check if  that email or username already exist
      const [usernameExist, emailExist] = await Promise.all([
        await UsersController.userExist(username),
        await UsersController.userExist(email),
      ]);
      if (usernameExist) {
        res.status(400).json({
          message: `'${username}' is taken`,
          data: null,
        });
        return;
      }
      if (emailExist) {
        res.status(400).json({
          message: `user already exist`,
          data: null,
        });
        return;
      }
      const defaultAvatar = `https://www.gravatar.com/avatar/${emailHash}.jpg?s=150`;
      const hashedPassword = await bcrypt.hash(String(password), 10);
      const userId = Utils.generateID();

      const newUser: IUser = {
        user_id: userId,
        fullname,
        email,
        username,
        password: hashedPassword,
        created_at: currentTime,
        profile_picture: defaultAvatar,
        friends: [],
      };
      // create a unique channel and set it's id to the user's id
      const newChannel = {
        channel_id: userId,
        owner_id: userId,
        members: [],
        created_at: currentTime,
        rooms: [],
        is_public: false,
      };
      await ChannelsController.addNewChannel(newChannel);
      const user = await (
        await UsersRepo
      ).createAndSave(newUser as unknown as EntityData);

      const userToView = Utils.omit(user, [
        "password",
        "email",
        "entityId",
        "friends",
      ]) as IUserToView;
      const userInfoForToken = Utils.pick(user, [
        "fullname",
        "username",
        "user_id",
      ]) as IUserForToken;
      Utils.generateToken(userInfoForToken, (err, encoded) => {
        if (err) throw err;
        res.status(201).json({
          message: "account created successfully",
          data: {
            token: encoded,
            expires_at: ms(config.jwt_expiration as string),
            user: userToView,
          },
        });
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      res.status(500).json({
        error,
        message: "An error occurred, couldn't create user",
      });
    }
  }
  static async loginUser(req: Request, res: Response) {
    try {
      const { username_or_email, password } = req.body;

      const [usernameExist, emailExist] = await Promise.all([
        await UsersController.userExist(username_or_email),
        await UsersController.userExist(username_or_email),
      ]);

      if (!(emailExist || usernameExist)) {
        res.status(400).json({
          message: `Invalid credentials`,
          data: null,
        });
        return;
      }
      // if the user was gotten by username, then assign user to it otherwise to email
      const user = usernameExist ? usernameExist : emailExist;
      const isPasswordMatch = await bcrypt.compare(
        String(password),
        user?.password as string
      );

      if (!isPasswordMatch) {
        res.status(400).json({ message: "Invalid credentials", data: null });
        return;
      }

      const userToView = Utils.omit<UsersEntity>(user as UsersEntity, [
        "password",
        "email",
        "entityId",
        "friends",
      ]) as IUserToView;
      const userInfoForToken = Utils.pick<UsersEntity>(user as UsersEntity, [
        "fullname",
        "username",
        "user_id",
      ]) as IUserForToken;

      Utils.generateToken(userInfoForToken, (err, encoded) => {
        if (err) throw err;
        res.status(201).json({
          message: "sign in successful",
          data: {
            token: encoded,
            expires_at: ms(config.jwt_expiration as string),
            user: userToView,
          },
        });
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      res.status(500).json({
        error,
        message: "An error occurred, couldn't login",
      });
    }
  }
  // static async getUsername(req: Request, res: Response) {
  //   //
  // }
  static async getUserById(userId: string) {
    const user = await (await UsersRepo)
      .search()
      .where("user_id")
      .equal(userId)
      .returnFirst();

    return user;
  }
  static async updateProfile(req: Request, res: Response) {
    const user = Utils.getAuthenticatedUser(req);
  }
  static async getFriends() {
    //
  }
  static async getDirectMessages() {
    //
  }
  static async getUserProfile(req: Request, res: Response) {
    try {
      const user = Utils.getAuthenticatedUser(req);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      res.status(500).json({
        error,
        message: "An error occurred, couldn't retrieve user profile",
      });
    }
  }

  static async userExist(emailOrUsername: string) {
    return await (await UsersRepo)
      .search()
      .where("email")
      .equal(emailOrUsername)
      .or("username")
      .matchesExactly(emailOrUsername)
      .returnFirst();
  }
}
