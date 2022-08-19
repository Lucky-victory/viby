import express, { Application, NextFunction, Response, Request } from "express";
const app: Application = express();
import { Server } from "socket.io";
import http from "http";
const server = http.createServer(app);
import { errorHandler } from "./middlewares/error-handler";
import cors from "cors";
import createError from "http-errors";
const PORT = process.env.PORT || 3300;

const io = new Server(server);
import socket from "./sockets/channels";
socket(io);

import signUpRouter from "./routes/sign-up";
import signInRouter from "./routes/sign-in";
import channelsRouter from "./routes/channels";
import usersRouter from "./routes/users";
import roomsRouter from "./routes/rooms";

// express middleware for JSON body
app.use(express.json());
// express middleware for url encoded body
app.use(
  express.urlencoded({
    extended: false,
  })
);
const whitelist: string[] = ["*"];
app.use(
  cors({
    origin: "*",
    /*
(origin, callback) => {
      if (whitelist.indexOf(origin as string) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },

    */
  })
);
// you can pass a prefix here, if you want, e.g /api/
const routesPrefix = "";
app.use(`${routesPrefix}/sign-up`, signUpRouter);
app.use(`${routesPrefix}/sign-in`, signInRouter);
app.use(`${routesPrefix}/channels`, channelsRouter);
app.use(`${routesPrefix}/rooms`, roomsRouter);
app.use(`${routesPrefix}/user`, usersRouter);

app.get("/", (req, res) => {
  res.send("<h1>Hello Viby</h1>");
});

// this middleware handles error for unavailable routes
app.use((req, res, next) => {
  next(createError(404));
});
// handles application wide error
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});
export { server, io };
server.listen(PORT, () => {
  console.log("server running on http://localhost:" + PORT);
});
