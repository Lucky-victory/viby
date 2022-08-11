import express from "express";
const app = express();
import { Server } from "socket.io";
import http from "http";
const server = http.createServer(app);

const PORT = process.env.PORT || 3300;
// import { redis as db } from "./db/index.js";
const io = new Server(server);
const channelsNamespace = io.of("/channels");

import signUpRouter from "./routes/sign-up";
import { AuthMiddleware } from "./middlewares/auth";

app.use("/", signUpRouter);

// authentication middleware
app.use(AuthMiddleware.authenticate);
app.get("/", (req, res) => {
  res.send("<h1>Hello Viby</h1>");
});
app.get("/channels", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
const channelsManager = channelsNamespace.on("connection", (socket) => {
  socket.on("joinChannel", (channelId) => {
    console.log(socket.id);
    socket.join(channelId);
    socket.on("joinRoom", (roomId) => {
      console.log(roomId);
    });
    console.log("connected " + channelId);

    socket.on("new message", (message) => {
      console.log(message);
    });
    channelsManager.to(channelId).emit("test", "hi" + channelId);
  });
});

server.listen(PORT, () => {
  console.log("server running on http://localhost:" + PORT);
});

// how to checked if a user was already a memeber in that server
// query the database for that user to see if they are among the prevoiusly stored server members
