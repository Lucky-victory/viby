import { Utils } from "./../utils/index";
import { Request, RequestHandler, Response } from "express";
import { redis as db } from "../db/index";
import { UsersEntity, UsersRepo } from "../models/users";
import { v4 as uuidV4 } from "uuid";
import pick from 'just-pick';
import ms from 'ms';
import config from "../config";
import bcrypt from 'bcrypt';

export default class UsersController {
  static async createNewUser(req: Request, res: Response) {
    try {
      
      const userRepo = await UsersRepo;
      const {fullname,username,email,password } = req.body;
      
    const hashedPassword = await bcrypt.hash(String(password), 10);

    const user = await userRepo.createAndSave({
      user_id: uuidV4(),
      fullname,
      email,
      username,
      password:hashedPassword,
      created_at: await db.time(),
    });
      await userRepo.createIndex();

      //pick()
    Utils.generateToken(user, (err, encoded) => {
      if (err) throw err;
      res.status(201).json({
        message: 'account created successfully',
        token: encoded,
        expires_at:ms(config.jwt_expiration as string),user
      })
    })
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
      //pick()
    Utils.generateToken(user, (err, encoded) => {
      if (err) throw err;
      res.status(201).json({
        message: 'login successfully',
        token: encoded,
        expires_at:ms(config.jwt_expiration as string),user
      })
    })
  }
    catch (error) {
      
      res.status(500).json({ error,message:'An error occurred, couldn\'t login' });
    }
  }
  static async getUsername(req: Request, res: Response) {
    const id = req.query.id;
    const userRepo = await UsersRepo;

    let users = await userRepo
      .search()
      .where("fullname")
      .match("benson")
      .return.all();
    users = JSON.parse(JSON.stringify(users));

    // users = pick<UsersEntity,<'username'>(users, [
    //   "username",
    //   "password",
    //   "user_id",
    //   "entityId",
    //   "email",
    // ]);

    res.status(200).json({
      users,
      result_count: users?.length,
    });
  }
  static async getUsersById(userId:string) {
const userRepo = await UsersRepo;

    const user=await userRepo
      .search()
      .where("user_id").equal(userId)
      .returnFirst();
      
    return user;
  }
  static async updateUser() {
    
  }
}
