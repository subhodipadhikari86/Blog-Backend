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
app.use(fileUpload({
    useTempFiles:true
}))
app.use(express.json());
app.use(express.urlencoded({extended:true}))
const server = createServer(app);

const io = new Server(server,{
    cors:{
        origin:'http://localhost:5173',
        credentials:true
    }
})  

connectSocket(io);
const corsOptions = {
    origin:'http://localhost:5173',
    credentials:true
}
app.use(cookieParser());

app.use(cors(corsOptions));
dotenv.config({});
const port = process.env.port || 3000;
app.use("/api/v1/user",userRoute)
app.use("/api/v1/blog",BlogRoute);
server.listen(port,()=>{
    console.log(`server is running at port ${port}`);
    connectDB();
})