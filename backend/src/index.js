const express = require("express");
const app = express();
const { Server } = require("socket.io");
const server = require("http").createServer(app);
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3300;
const io = new Server(server);

app.get("/", (req, res) => {
  // eslint-disable-next-line no-undef
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
r;
