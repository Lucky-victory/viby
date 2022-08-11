import { Utils } from "./../utils/index";
import { Request, RequestHandler, Response } from "express";
import { redis as db } from "../db/index";
import { UsersEntity, UsersRepo } from "../models/users";
import { v4 as uuidV4 } from "uuid";

export default class UsersController {
  static async createNewUser(req: Request, res: Response) {
    const userRepo = await UsersRepo;
    const user = userRepo.createEntity({
      user_id: uuidV4(),
      fullname: "benson blessing",
      username: "bensonblizzy",
      created_at: await db.time(),
    });
    await userRepo.createIndex();

    const s = await userRepo.save(user);
    res.status(200).json({ s, v: user.userName });
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

    users = Utils.getPropsFromObject<UsersEntity>(users, [
      "username",
      "password",
      "user_id",
      "entityId",
      "email",
    ]) as UsersEntity[];

    res.status(200).json({
      users,
      result_count: users?.length,
    });
  }
  static async getUser(req: Request, res: Response) {}
}
