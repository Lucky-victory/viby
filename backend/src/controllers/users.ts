import { Utils } from "./../utils/index";
import { Request, Response } from "express";
import {  UsersRepo } from "../models/users";
import { v4 as uuidV4 } from "uuid";
import ms from 'ms';
import config from "../config";
import bcrypt from 'bcrypt';
import { IUser, IUserForToken, IUserToView } from "../interfaces/user.interface";
import { EntityData } from "redis-om";
export default class UsersController {
  static async createNewUser(req: Request, res: Response) {
    try {
      
      const currentTime = new Date().getTime();
      const {fullname,username,email,password } = req.body;
      const hashedPassword = await bcrypt.hash(String(password), 10);

      const newUser:IUser = {
       user_id: uuidV4(),
      fullname,
      email,
      username,
      password:hashedPassword,
        created_at: currentTime,
      friends:[]
    }

    const user = await (await UsersRepo).createAndSave(newUser as unknown as EntityData);
      await (await UsersRepo).createIndex();

      const userToView = Utils.omit(user, ['password', 'email', 'entityId', 'friends']) as IUserToView;
      const userInfoForToken = Utils.pick(user, ['fullname', 'username', 'user_id']) as IUserForToken;
      Utils.generateToken(userInfoForToken, (err, encoded) => {
        if (err) throw err;
        res.status(201).json({
          message: 'account created successfully',
          data: {
            
            token: encoded,
            expires_at: ms(config.jwt_expiration as string),
            user: userToView,
          }
        });
      });
  }
    catch (error) {
      
      res.status(500).json({ error,message:'An error occurred, couldn\'t create user' });
    }
  }
  static async loginUser(req: Request, res: Response) {
    try {
      
      const userRepo = await UsersRepo;
      const {username_or_email,password } = req.body;

      const user = await userRepo.search().where('email').equal(username_or_email).or('username').equal(username_or_email).returnFirst();
      if (!user) {
        res.status(400).json({ message: 'Invalid credentials', user: null });
        return
      }
      const isPasswordMatch = await bcrypt.compare(String(password), user?.password);

      if (!isPasswordMatch) {
        res.status(400).json({ message: 'Invalid credentials', user: null });
        return
      }
    
      const userToView = Utils.omit(user, ['password', 'email', 'entityId', 'friends']) as IUserToView;
   const userInfoForToken = Utils.pick(user, ['fullname', 'username', 'user_id']) as IUserForToken;
      Utils.generateToken(userInfoForToken, (err, encoded) => {
        if (err) throw err;
        res.status(201).json({
          message: 'account created successfully',
          data: {
            token: encoded,
            expires_at: ms(config.jwt_expiration as string),
            user: userToView,
          }
        });
      });
  }
    catch (error) {
      
      res.status(500).json({ error,message:'An error occurred, couldn\'t login' });
    }
  }
  static async getUsername(req: Request, res: Response) {
   //
  }
  static async getUserById(userId:string) {


    const user=await (await UsersRepo)
      .search()
      .where("user_id").equal(userId)
      .returnFirst();
      
    return user;
  }
  static async updateUser() {
    //
  }
}
