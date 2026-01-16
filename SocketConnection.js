import { Server } from "node:http";
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser";
const myMap = new Map()
export const connectSocket = (io)=>{

    // console.log("hello boy");
    io.use((socket,next)=>{
        cookieParser()(socket.request,socket.request.res,async(err)=>{
            const token = socket.request.cookies.token;
            if(!token)return next(new Error("Authentication Error"))
            const decode = await jwt.verify(token,process.env.SECRET_KEY)
            socket.userid = decode.userid
            const id = decode.userid
            myMap.set(id,socket.id)
            // console.log("userid is",id);
            // console.log(myMap.get(id));
            
            next()
        })
    })

    io.on("connection",(socket)=>{
        
        socket.on("chat-msg",(obj)=>{
            const text = obj.text
            const userId = obj.userid
            const socketId = myMap.get(userId)
            // console.log("i am the userid",userId);
            // console.log("i am the msg socket id",socketId);
            // console.log("sending msg",text);
            
            socket.to(socketId).emit("recieve",text);
        })

        socket.on("join-group",({group_name,userId,userName})=>{
            socket.join(group_name);
            let txt = `${userName} joined the Groupd`
            socket.to(group_name).emit("joinGroup",txt);
        })

        socket.on("grp-msg",({group_name,userId,userName,msg})=>{
            socket.to(group_name).emit("grpMsg",msg);
        })
    })

}