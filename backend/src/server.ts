import express from "express";
const app = express();
import { Server } from "socket.io";
import http from "http";
const server = http.createServer(app);

const PORT = process.env.PORT || 3300;
// import { redis as db } from "./db/index.js";
const io = new Server(server);
import socket from './sockets/channels';
socket(io);

import signUpRouter from "./routes/sign-up";
import { AuthMiddleware } from "./middlewares/auth";

app.use("/", signUpRouter);

// authentication middleware
// app.use(AuthMiddleware.authenticate);
app.get("/", (req, res) => {
  res.send("<h1>Hello Viby</h1>");
});
app.get("/channels", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});


// how to checked if a user was already a memeber in that server
// query the database for that user to see if they are among the prevoiusly stored server members
export { server,io };
server.listen(PORT, () => {
  console.log("server running on http://localhost:" + PORT);
});