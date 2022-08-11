import { Request, RequestHandler, Response } from "express";
import { redis as db } from "../db/index";
import { UsersRepo } from "../models/users";
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

    const user = await userRepo
      .search()
      .where("fullname")
      .match("benson")
      .return.allKeys();
    res.status(200).send({
      user,
    });
  }
  static async getUser(req: Request, res: Response) {}
}
