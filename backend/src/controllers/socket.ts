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
      console.log("socket id", socket.id);
      // get previous messages when a user joins a room
      //   console.log(channelId, roomId);
      const result = await MessagesController.getMessages(channelId, roomId);
      console.log(result);

      socket.join(roomId);
      channelsManager.to(socket.id).emit("join_room", result?.data, user);
    } catch (error) {
      console.log(error);

      //
    }
  }
  static async onLeaveRoom() {
    //
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
    message["status"] = "edited";
    const result = await MessagesController.updateMessage(message, user);
    const messageWithUser: IMessageToView = {
      ...message,
      user,
    };
    if (!result?.success) {
      // if there was an error editing the message
      // change the status back to sent, since it was already initially sent
      messageWithUser["status"] = "sent";
      //then  emit it to only the user that sent it.
      channelsManager
        .to(socket.id)
        .emit("edit_message", messageWithUser, result?.success);
      return;
    }
    // query the database for the editted message and return it
    const editedMessage = await MessagesController.getMessageById(
      message?.message_id
    );
    editedMessage["user"] = user;
    // broadcast the message to everyone, sender inclusive
    channelsManager
      .to(roomId)
      .emit("edit_message", editedMessage, result?.success);
  }
}
