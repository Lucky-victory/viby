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
      console.log(error);
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
    try {
      const authUser = Utils.getAuthenticatedUser(req);
      const { username, email, fullname, profile_picture, cover_picture, bio } =
        req.body;
      const user = await UsersController.getUserById(authUser?.user_id);
      if (!user) {
        res.status(404).json({
          message: "user does not exist",
          data: null,
        });
        return;
      }
      const isAuthorized = UsersController.hasAccess(authUser, user);
      if (!isAuthorized) {
        res.status(401).json({
          message: "Unauthorized",
        });
        return;
      }

      await user.update({
        email,
        fullname,
        cover_picture,
        profile_picture,
        username,
        bio,
      });
      await (await UsersRepo).save(user);

      const userToView = Utils.omit(user, [
        "email",
        "password",
        "entityId",
        "friends",
      ]);
      res.status(200).json({
        message: "Profile updated successfully",
        data: userToView,
      });
    } catch (error) {
      res.status(500).json({
        message: "An occured, couldn't update profile",
      });
    }
  }

  static async getUser(req: Request, res: Response) {
    try {
      const authUser = Utils.getAuthenticatedUser(req);
      const { user_id } = req.params;
      const user = await UsersController.getUserById(user_id);
      const sender = await UsersController.getUserById(authUser?.user_id);

      if (!user) {
        res.status(404).json({
          message: `user with id '${user_id}' does not exist`,
          data: null,
        });
        return;
      }
      let userToView = Utils.omit(user as UsersEntity, [
        "entityId",
        "email",
        "password",
        "friends",
      ]);

      // check if they are friends,
      const is_friend = sender?.isFriend(user?.user_id);
      userToView = Utils.merge(userToView, { is_friend });

      res.status(200).json({
        message: "user retrieved successfully",
        data: userToView,
      });
    } catch (error: any) {
      res.status(500).json({
        message: error?.message || "An error occured, couldn't fetch user",
      });
    }
  }
  static async getFriends() {
    //
  }
  static async addFriend(req: Request, res: Response) {
    try {
      const { user_id } = req.body;
      const authUser = Utils.getAuthenticatedUser(req);
      const reciever = await UsersController.getUserById(user_id);

      const sender = await UsersController.getUserById(authUser?.user_id);
      if (!reciever) {
        res.status(404).json({
          message: `user with id '${user_id}' does not exist`,
          data: null,
        });
        return;
      }
      // currently, they both become friends automatically without approval,
      // this will be changed in future,
      reciever?.addFriend(authUser?.user_id);
      sender?.addFriend(user_id);
      await (await UsersRepo).save(sender as UsersEntity);
      await (await UsersRepo).save(reciever as UsersEntity);
      res.status(200).json({
        message: "You are now friends",
        data: null,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "An error occured, couldn't add friend" });
    }
    //
  }
  static async getDirectMessages(req: Request, res: Response) {
    try {
      const user = Utils.getAuthenticatedUser(req);
      const userId = user?.user_id;
      // each user has a predefined channel
      // get a channel where the channel_id is the same as the user_id
      const userChannel = await ChannelsController.channelExist(userId);
      if (!userChannel) {
        res.status(404).json({
          message: `channel with id '${userId}' does not exist`,
          data: null,
        });
        return;
      }
      const roomsToView = await ChannelsController.getRoomsInChannel(
        userChannel
      );
      res.status(200).json({
        message: "direct messages retrieved successfully",
        data: roomsToView,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "An error occured, couldn't fetch messages" });
    }
  }
  static async getUserProfile(req: Request, res: Response) {
    try {
      const user = Utils.getAuthenticatedUser(req);
      const userDetails = await (await UsersRepo)
        .search()
        .where("user_id")
        .equal(user?.user_id)
        .returnFirst();
      const userToView = Utils.omit(userDetails as UsersEntity, ["password"]);
      res.status(200).json({
        data: userToView,
        message: "profile retrieved successfully",
      });
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
  static hasAccess(authUser: IUserForToken, user: UsersEntity) {
    return authUser?.user_id === user?.user_id;
  }
}
