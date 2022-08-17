import { Server } from "socket.io";
import { IUser } from "../interfaces/user.interface";
import merge from "just-merge";
import MessagesController from "../controllers/messages";

export default (io: Server) => {
  const channelsNamespace = io.of("/channels");
  const typingUsers: IUser[] = [];
  const channelsManager = channelsNamespace.on("connection", (socket) => {
    socket.on("join_channel", (channelId) => {
      console.log("socket id", socket.id);
    });
    socket.on("join_room", (roomId) => {
      console.log(roomId);
      socket.join(roomId);
    });

    socket.on("new_message", async (message, roomId, user) => {
      await MessagesController.createNewMessage(message);
      const messageWithUser = {
        ...message,
        user,
      };
      socket.on("typing", (user, roomId) => {
        typingUsers.push(user);

        console.log(typingUsers);

        socket.to(roomId).emit("typing", typingUsers);
      });
      console.log(messageWithUser);
      channelsManager.to(roomId).emit("receive_message", messageWithUser);
    });
  });
};
