import { Server } from "socket.io";
import MessagesController from "../controllers/messages";
import { IMessageToDB, IMessageToView } from "../interfaces/message.interface";
import { IUserToView } from "../interfaces/user.interface";

export default (io: Server) => {
  const channelsNamespace = io.of("/channels");
  let typingUsers: IUserToView[] = [];
  const channelsManager = channelsNamespace.on("connection", (socket) => {

/**
 * @todo Implement events with callback arg
 */

    // emitted when a user joins a channel
    socket.on("join_channel", (channelId:string,user:IUserToView) => {
    });
    
    // emitted when a user joins a room
    socket.on("join_room", async (channelId: string, roomId: string,user:IUserToView) => {
      console.log("socket id", socket.id);
      // get previous messages when a user joins a room
      const result = await MessagesController.getMessages(channelId, roomId);
      // console.log(result);
      
      socket.join(roomId);
      channelsManager.to(socket.id).emit("join_room", result?.data,user);
    });
    // emitted when a user starts typing
    socket.on("typing", (user: IUserToView, roomId: string) => {
      typingUsers.push(user)
      // check if the typing user was already among the typing users,
      // if true, return that user otherwise add it to the array
      typingUsers = typingUsers.reduce((acc, _user) => {
        
        _user?.user_id === user?.user_id ? acc.push(user):acc;
        return acc
      },[] as IUserToView[])
        
      
      
      console.log(user);
      console.log(typingUsers);
      socket.to(roomId).emit("typing", typingUsers);
    });
    // emitted when a user stops typing
    socket.on("stop_typing", (user, roomId) => {
      // remove the user that stopped typing
      typingUsers = typingUsers.filter(
        (_user) => _user?.user_id !== user?.user_id
      );

      socket.to(roomId).emit("stop_typing", typingUsers);
    });
    // emiited when a new message is sent
    socket.on(
      "new_message",
      async (message: IMessageToDB, roomId: string, user: IUserToView) => {
        // save the message to database
        message["status"] = "sent";
        const result = await MessagesController.createMessage(message);
        const messageWithUser: IMessageToView = {
          ...message,
          user,
        };
        if (!result?.success) {
          messageWithUser["status"] = "error";
          channelsManager.to(socket.id).emit("new_message", messageWithUser);
          return;
        }
        // broadcast the message to everyone, sender inclusive
        channelsManager.to(roomId).emit("new_message", messageWithUser);
      }
    );
    // emiited when a new message is sent
    socket.on(
      "edit_message",
      async (message: IMessageToDB, roomId: string, user: IUserToView) => {
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
    );
    channelsManager.on("disconnect", (roomId: string) => {
      console.log("disconnected");

      channelsManager.to(roomId).emit("is_disconnected");
    });
  });
};
