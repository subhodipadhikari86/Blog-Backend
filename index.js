import express from "express";
import connectDB from "./utils/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import userRoute from "./Routes/userRoute.js";
import { createServer } from "node:http";
import BlogRoute from "./Routes/BlogRoutes.js";
import { Server } from "socket.io";
import { connectSocket } from "./SocketConnection.js";
import fileUpload from "express-fileupload";

dotenv.config({});

const app = express();

app.use(fileUpload({
  useTempFiles: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  "https://blog-subh.netlify.app",
  "https://blog-frontend-7rfo.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  }
});

connectSocket(io);

app.use("/api/v1/user", userRoute);
app.use("/api/v1/blog", BlogRoute);

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`server is running at port ${port}`);
  connectDB();
});
