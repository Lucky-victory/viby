import { Utils } from "./../utils/index";
import { Request, RequestHandler, Response } from "express";
import { redis as db } from "../db/index";
import { UsersEntity, UsersRepo } from "../models/users";
import { v4 as uuidV4 } from "uuid";
import pick from 'just-pick';

export default class UsersController {
  static async createNewUser(req: Request, res: Response) {
    const userRepo = await UsersRepo;
    const user = await userRepo.createAndSave({
      user_id: uuidV4(),
      fullname: "benson blessing",
      username: "bensonblizzy",
      created_at: await db.time(),
    });
    await userRepo.createIndex();

    res.status(200).json({ s: user.userName });
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
  static async getUser(req: Request, res: Response) {}
}
