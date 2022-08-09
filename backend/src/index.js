const express = require("express");
const app = express();
const { Server } = require("socket.io");
const server = require("http").createServer(app);
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3300;
const io = new Server(server);

app.get("/", (req, res) => {
  // eslint-disable-next-line no-undef
  res.send('<h1>Hello Viby</h1>');
});
app.get("/server", (req, res) => {
  // eslint-disable-next-line no-undef
  res.sendFile(__dirname + "/index.html");
});
const manager=io.of('/server').on("connection", (socket) => {
  socket.on('join', (roomId) => {
    console.log(socket.id);
    socket.join(roomId);
    console.log("connected "+roomId);
    
    socket.on("new message", (message) => {
      console.log(message);
    });
  manager.to(roomId).emit('test','hi'+roomId)
})
});


server.listen(PORT, () => {
  console.log("server running on http://localhost:" + PORT);
});

// how to checked if a user was already a memeber in that server
// query the database for that user to see if they are among the prevoiusly stored server members