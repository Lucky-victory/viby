import { Server } from "socket.io";
import SocketController from "../controllers/socket";
import { IMessageToDB } from "../interfaces/message.interface";
import { IUserToView } from "../interfaces/user.interface";

export default (io: Server) => {
  const channelsNamespace = io.of("/socket");

  const channelsManager = channelsNamespace.on("connection", (socket) => {
    // emitted when a user joins a channel
    socket.on("join_channel", async (channelId: string, user: IUserToView) => {
      await SocketController.onJoinChannel(channelId, user);
    });

    // emitted when a user joins a room
    socket.on(
      "join_room",
      async (channelId: string, roomId: string, user: IUserToView) => {
        await SocketController.onJoinRoom(
          channelsManager,
          socket,
          channelId,
          roomId,
          user
        );
      }
    );
    // emitted when a user starts typing
    socket.on("typing", (roomId: string, user: IUserToView) =>
      SocketController.onTyping(socket, roomId, user)
    );

    // emitted when a user stops typing
    socket.on("stop_typing", (user: IUserToView, roomId: string) =>
      SocketController.onStopTyping(socket, roomId, user)
    );
    // emiited when a new message is sent
    socket.on(
      "new_message",
      async (message: IMessageToDB, roomId: string, user: IUserToView) => {
        await SocketController.onNewMessage(
          channelsManager,
          socket,
          message,
          roomId,
          user
        );
      }
    );
    // emiited when a new message is sent
    socket.on(
      "edit_message",
      async (message: IMessageToDB, roomId: string, user: IUserToView) => {
        await SocketController.onEditMessage(
          channelsManager,
          socket,
          message,
          roomId,
          user
        );
      }
    );
    socket.on("disconnect", (roomId: string) => {
      console.log("disconnected");

      channelsManager.to(roomId).emit("is_disconnected");
    });
  });
};
