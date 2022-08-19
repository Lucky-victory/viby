import Utils from "./../utils/index";
import { Request, Response } from "express";
import { UsersRepo } from "../models/users";
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

export default class UsersController {
  static async createNewUser(req: Request, res: Response) {
    try {
      const currentTime = Utils.currentTime;

      let { email } = req.body;
      const { fullname } = req.body;
      // the username to be used if no username was supplied in the request
      const defaultUsername = Utils.generateUsername(fullname);
      const { username = defaultUsername, password } = req.body;
      email = Utils.lower(email);
      const emailHash = md5(email);

      // check if  that email or username already exist
      const [emailExist] = await Promise.all([
      await  UsersController.userExist(email),
    
      ]);
     /* if (usernameExist) {
        res.status(400).json({
          message: `'${username}' is taken`,
          data: null,
        });
        return;
      }*/
      if (emailExist) {
        res.status(400).json({
          message: `user already exist`,
          data: null,
        });
        return;
      }
      const defaultAvatar = `https://www.gravatar.com/avatar/${emailHash}.jpg?s=150`;
      const hashedPassword = await bcrypt.hash(String(password), 10);

      const newUser: IUser = {
        user_id: Utils.generateID(),
        fullname,
        email,
        username,
        password: hashedPassword,
        created_at: currentTime,
        profile_picture: defaultAvatar,
        friends: [],
      };

      const user = await (
        await UsersRepo
      ).createAndSave(newUser as unknown as EntityData);
      await (await UsersRepo).createIndex();

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
    } catch (error) {
      res
        .status(500)
        .json({ error, message: "An error occurred, couldn't create user" });
    }
  }
  static async loginUser(req: Request, res: Response) {
    try {
      const { username_or_email, password } = req.body;

      const user = await UsersController.userExist(username_or_email);
      if (!user) {
        res.status(400).json({ message: "Invalid credentials", user: null });
        return;
      }
      const isPasswordMatch = await bcrypt.compare(
        String(password),
        user?.password
      );

      if (!isPasswordMatch) {
        res.status(400).json({ message: "Invalid credentials", data: null });
        return;
      }

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
    } catch (error) {
      res
        .status(500)
        .json({ error, message: "An error occurred, couldn't login" });
    }
  }
  static async getUsername(req: Request, res: Response) {
    //
  }
  static async getUserById(userId: string) {
    const user = await (await UsersRepo)
      .search()
      .where("user_id")
      .equal(userId)
      .returnFirst();

    return user;
  }
  static async updateUser() {
    //
  }

  static async userExist(emailOrUsername: string) {
    
      
      return (await UsersRepo)
        .search()
        .where("email")
        .equal(emailOrUsername)
        .or("username")
        .equal(emailOrUsername)
        .returnFirst();
    
  }
}
