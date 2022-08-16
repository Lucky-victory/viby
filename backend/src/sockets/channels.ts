
import { Server } from 'socket.io';

export default (io:Server) => {
const channelsNamespace = io.of("/channels");
    
    const channelsManager = channelsNamespace.on("connection", (socket) => {
      socket.on("join_channel", (channelId) => {
        console.log('socket id', socket.id);
      });
      socket.on("join_room", (roomId) => {
        console.log(roomId);
        socket.join( roomId);
    });
  

      socket.on("new_message", (message, roomId, user) => {
        const messageWithUser = {
        ...message,user
        }
        
        console.log(messageWithUser);
        socket.to(roomId).emit('receive_message',messageWithUser);
    });
});
   
    }