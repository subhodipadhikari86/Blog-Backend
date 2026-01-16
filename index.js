import express, { urlencoded } from "express"
import connectDB from "./utils/db.js";
import cors from "cors"
const app = express();

import cookieParser from "cookie-parser";
import dotenv from "dotenv"
import userRoute from "./Routes/userRoute.js"
import { createServer } from 'node:http';
import BlogRoute from "./Routes/BlogRoutes.js"
import { Server } from "socket.io";
import { connectSocket } from "./SocketConnection.js";
import fileUpload from "express-fileupload";
dotenv.config({});
app.use(fileUpload({
    useTempFiles:true
}))
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(express.json());
app.use(express.urlencoded({extended:true}))
const server = createServer(app);

const io = new Server(server,{
    cors:{
        origin:FRONTEND_URL,
        credentials:true
    }
})  

connectSocket(io);
const corsOptions = {
    origin:FRONTEND_URL,
    credentials:true
}
app.use(cookieParser());

app.use(cors(corsOptions));

const port = process.env.port || 3000;
app.use("/api/v1/user",userRoute)
app.use("/api/v1/blog",BlogRoute);
server.listen(port,()=>{
    console.log(`server is running at port ${port}`);
    connectDB();
})