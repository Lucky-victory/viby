import { Socket, Namespace } from "socket.io";
import { IMessageToDB, IMessageToView } from "../interfaces/message.interface";
import { IUserToView } from "../interfaces/user.interface";
import MessagesController from "./messages";

export default class SocketController {
  static async onJoinChannel(channelId: string, user: IUserToView) {
    //
  }
  static async onJoinRoom(
    channelsManager: Namespace,
    socket: Socket,
    channelId: string,
    roomId: string,
    user: IUserToView
  ) {
    try {
      console.log("socket id", socket.id, channelId, roomId);
      // get previous messages when a user joins a room
      const result = await MessagesController.getMessages(channelId, roomId);

      socket.join(roomId);
      channelsManager.to(socket.id).emit("join_room", result?.data, user);
    } catch (error) {
      console.log(error);

      //
    }
  }
 
  static async onNewMessage(
    channelsManager: Namespace,
    socket: Socket,
    message: IMessageToDB,
    roomId: string,
    user: IUserToView
  ) {
    //merge the user with the message
    const { messageToDB, messageToView } = MessagesController.addUserToMessage(
      message,
      user
    );

    // save the message to database
    const result = await MessagesController.createMessage(messageToDB);

    if (!result?.success) {
      messageToView["status"] = "error";
      channelsManager.to(socket.id).emit("new_message", messageToView);
      return;
    }

    // broadcast the message to everyone, sender inclusive
    channelsManager.to(roomId).emit("new_message", messageToView);
  }
  static async privateMessage() {
    //
  }
  static onTyping(socket: Socket, roomId: string, user: IUserToView) {
    socket.to(roomId).emit("typing", user, roomId);
  }
  static onStopTyping(socket: Socket, roomId: string, user: IUserToView) {
    socket.to(roomId).emit("stop_typing", user, roomId);
  }
  static async onEditMessage(
    channelsManager: Namespace,
    socket: Socket,
    message: IMessageToDB,
    roomId: string,
    user: IUserToView
  ) {
    // save the message to database

    const { messageToDB, messageToView } = MessagesController.addUserToMessage(
      message,
      user,
      false
    );
    const result = await MessagesController.updateMessage(messageToDB, user);

    if (!result?.success) {
      // if there was an error editing the message
      // change the status back to sent, since it was already initially sent
      console.log("not editted");

      messageToView["status"] = "sent";
      //then  emit it to only the user that sent it.
      channelsManager
        .to(socket.id)
        .emit("edit_message", messageToView, result?.success);
      return;
    }

    // broadcast the message to everyone, sender inclusive
    channelsManager
      .to(roomId)
      .emit("edit_message", messageToView, result?.success);
  }
  static async onDeleteMessage(
    channelsManager: Namespace,
    socket: Socket,
    message: IMessageToDB,
    roomId: string,
    user: IUserToView
  ) {
    // delete the message from database

    const { messageToDB, messageToView } = MessagesController.addUserToMessage(
      message,
      user,
      false
    );
    const result = await MessagesController.deleteMessage(messageToDB, user);

    if (!result?.success) {
      // if there was an error deleting the message
      // change the status back to sent,
      console.log("not deleted");

      messageToView["status"] = "sent";
      //then  emit it to only the user that sent it.
      channelsManager
        .to(socket.id)
        .emit("delete_message", messageToView, result?.success);
      return;
    }

    // broadcast the message to everyone, sender inclusive
    channelsManager
      .to(roomId)
      .emit("delete_message", messageToView, result?.success);
  }
}
