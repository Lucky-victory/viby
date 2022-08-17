import { Request, Response } from "express";
import { IMessageToDB } from "../interfaces/message.interface";
import { IUser } from "../interfaces/user.interface";
import { MessagesEntity, MessagesRepo } from "../models/messages";

export default class MessagesController {
  static async createMessage(message: IMessageToDB) {
    try {
      
      await (await MessagesRepo).createAndSave(message);
      (await MessagesRepo).createIndex();
      return {success:true,error:null}
    }
    catch (error) {
      if (error) return {success:false,error}
    }
    
  }
  static async getMessages(req: Request, res: Response) {
    try {
      const { channel_id, room_id } = req.params;
      let { limit = 100 } = req.query;
      limit = +limit;
      const messages = await(await MessagesRepo).search()
        .where("channel_id")
        .equal(channel_id)
        .and("room_id")
        .equal(room_id)
        .sortDescending("created_at")
        .returnAll({ pageSize: limit as number });
      
      res.json({
        message:'messages retrieved successfully',
        data:messages
      })
    } catch (error) {
      res.status(500).json({
        error,
        message: "An error occurred, couldn't retrieve messages",
      });
    }
  }
  static async updateMessage(message: IMessageToDB,user:IUser) {
    try {
      const isAuthorized = this.hasAccess(message, user);
      if (!isAuthorized) {
        
        return {success:false,error:null}
      }
      const prevMessage = await (await MessagesRepo).search().where('message_id').equal(message?.message_id).returnFirst() as MessagesEntity;
      // update the content of the previous message and save it
      prevMessage.content = message?.content;
      await (await MessagesRepo).save(prevMessage);

      
      return {success:true,error:null}
    }
    catch (error) {
      if (error) return {success:false,error}
    }
  }
  static async deleteMessage(message: IMessageToDB,user:IUser) {
        try {
      const isAuthorized = this.hasAccess(message, user);
      if (!isAuthorized) {
        
        return {success:false,error:null}
      }
      const prevMessage = await (await MessagesRepo).search().where('message_id').equal(message?.message_id).returnFirst() as MessagesEntity;
     
      await (await MessagesRepo).remove(prevMessage.entityId);
      return {success:true,error:null}
    }
    catch (error) {
      if (error) return {success:false,error}
    }
  }
  private static hasAccess(message: IMessageToDB, user: IUser) {
    return message?.user_id === user?.user_id;
  }
}
