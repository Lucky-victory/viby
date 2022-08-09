const express = require("express");
const app = express();
const { Server } = require("socket.io");
const server = require("http").createServer(app);
const PORT = process.env.PORT || 3300;
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("connected");
  if (socket.connected) {
    socket.on("new message", (message) => {
      console.log(message);
    });
  }
});
server.listen(PORT, () => {
  console.log("server running on http://localhost:" + PORT);
});

module.exports = {
  io,
};
