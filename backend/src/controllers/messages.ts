import pluck from "just-pluck-it";
import {
  IMessageStatus,
  IMessageToView,
} from "./../interfaces/message.interface";
import { IMessageToDB } from "../interfaces/message.interface";
import { IUserToView } from "../interfaces/user.interface";
import { MessagesEntity, MessagesRepo } from "../models/messages";
import Utils from "../utils";
import UsersController from "./users";
import { UsersEntity } from "../models/users";

export default class MessagesController {
  static async createMessage(message: IMessageToDB) {
    try {
      await (await MessagesRepo).createAndSave(message);

      return { success: true, error: null };
    } catch (error) {
      if (error) return { success: false, error };
    }
  }
  static addUserToMessage(
    message: IMessageToDB,
    user: IUserToView,
    isCreate = true
  ) {
    if (isCreate) {
      message.status = "sent";
      message.created_at = Utils.currentTime;
    } else {
      message.status = "edited";
    }
    const messageToDB = message;

    const messageToView: IMessageToView = Utils.merge(message, { user });
    console.log(messageToView);

    return {
      messageToView,
      messageToDB,
    };
  }
  static async getMessages(
    channelId: string,
    roomId: string,
    options: { limit?: number; page?: number } = {}
  ) {
    try {
      const room_id = roomId;
      const channel_id = channelId;
      if (!(room_id && channelId))
        return {
          message: "no channelid or roomid provided",
          data: [],
          error: null,
        };
      let { limit = 100, page = 1 } = options;
      limit = +limit;
      page = +page;
      const offset = limit * (page - 1);

      let messages = await (await MessagesRepo)
        .search()
        .where("channel_id")
        .equal(channel_id)
        .and("room_id")
        .equal(room_id)
        .sortAscending("created_at")
        .page(offset, limit);

      messages = JSON.parse(JSON.stringify(messages));
      const userIds = pluck(messages, "user_id");

      // get users by message userid and merge the message with the user
      // based on userid
      const messageOwners = await Promise.all(
        userIds.map(async (userId) => {
          const user = await UsersController.getUserById(userId);

          const userToView = Utils.omit(user as UsersEntity, [
            "password",
            "email",
            "friends",
            "entityId",
          ]) as IUserToView;

          return userToView;
        })
      );

      const messagesWithUser: IMessageToView[] = Utils.arrayMergeObject(
        messages,
        messageOwners
      );

      // remove some unwanted properties
      const messagesToView = Utils.omit(messagesWithUser, [
        "entityId",
      ]) as IMessageToView[];
      return {
        message: "messages retrieved successfully",
        data: messagesToView,
        error: null,
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error)
        throw {
          data: null,
          error,
          message: "An error occurred, couldn't retrieve messages",
        };
    }
  }
  static async updateMessage(message: IMessageToDB, user: IUserToView) {
    try {
      const isAuthorized = MessagesController.hasAccess(message, user);
      if (!isAuthorized) {
        return { success: false, error: null };
      }
      const prevMessage = (await MessagesController.messageExist(
        message?.message_id
      )) as MessagesEntity;
      if (prevMessage) {
        // update the content of the previous message and save it
        prevMessage.content = message?.content;
        prevMessage.status = message?.status as IMessageStatus;
        await (await MessagesRepo).save(prevMessage);
        console.log(prevMessage, "edittttt");

        return { success: true, error: null };
      }
      return { success: true, error: null };
    } catch (error) {
      if (error) return { success: false, error };
    }
  }
  static async deleteMessage(message: IMessageToDB, user: IUserToView) {
    try {
      const isAuthorized = MessagesController.hasAccess(message, user);
      if (!isAuthorized) {
        return { success: false, error: null };
      }
      const prevMessage = (await MessagesController.messageExist(
        message?.message_id
      )) as MessagesEntity;
      if (prevMessage) {
        await (await MessagesRepo).remove(prevMessage?.entityId);
        return { success: true, error: null };
      }
      return { success: false, error: null };
    } catch (error) {
      if (error) return { success: false, error };
    }
  }

  /**
   * Get a message by it's Id
   * @param messageId
   */
  static async getMessageById(messageId: string) {
    const message = (await MessagesController.messageExist(
      messageId
    )) as MessagesEntity;
    // remove some unwanted properties
    const messageToView = Utils.omit(message, ["entityId"]) as IMessageToView;
    return messageToView;
  }
  /**
   * check if a message exist
   * @param messageId
   * @returns
   */
  static async messageExist(messageId: string) {
    return await (await MessagesRepo)
      .search()
      .where("message_id")
      .equal(messageId)
      .returnFirst();
  }
  /**
   * check if the user performing an action has access
   * @param message
   * @param user
   * @returns
   */
  private static hasAccess(message: IMessageToDB, user: IUserToView) {
    return message?.user_id === user?.user_id;
  }
}
