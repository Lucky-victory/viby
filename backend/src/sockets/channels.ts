import { io } from '../server';
import { Server} from 'socket.io';

export default (io:Server) => {
const channelsNamespace = io.of("/channels");
    
    const channelsManager = channelsNamespace.on("connection", (socket) => {
        socket.on("join_channel", (channelId) => {
    console.log(socket.id);
    socket.join(channelId);
    socket.on("join_room", (roomId) => {
      console.log(roomId);
    });
    console.log("connected " + channelId);

    socket.on("new_message", (message) => {
      console.log(message);
    });
    channelsManager.to(channelId).emit("test", "hi" + channelId);
  });
});
   
    }