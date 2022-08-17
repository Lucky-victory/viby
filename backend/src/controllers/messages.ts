import { IMessageToDB } from "../interfaces/message.interface";
import { MessagesRepo } from "../models/messages";
import { Request, Response } from "express";

export default class MessagesController {
  static async createNewMessage(message: IMessageToDB) {
    const messageRepo = await MessagesRepo;

    const msg = await messageRepo.createAndSave(message);
    await messageRepo.createIndex();
    console.log(msg, "to db");
  }
  static async getMessages(req: Request, res: Response) {
    try {
      const { channel_id, room_id } = req.params;
      let { limit = 100 } = req.query;
      limit = +limit;
      const messageRepo = await MessagesRepo;
      const messages = await messageRepo
        .search()
        .where("channel_id")
        .equal(channel_id)
        .and("room_id")
        .equal(room_id)
        .sortDescending("created_at")
        .returnAll({ pageSize: limit as number });
    } catch (error) {
      res.status(500).json({
        error,
        message: "An error occurred, couldn't retrieve messages",
      });
    }
  }
}
