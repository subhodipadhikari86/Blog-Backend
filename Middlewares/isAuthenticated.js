import jwt from "jsonwebtoken"
export const isAuthenticated = async(req,res,next)=>{
    try{
        // console.log("hey");
        
        const token = req.cookies.token;
        if(!token){
            return res.status(400).json({
                message:"user not authenticated LogIn first",
                success:false
            })
        }
        const decode = await jwt.verify(token,process.env.SECRET_KEY);
        if(!decode){
            return res.status(401).json({
                message:"invalid token",
                success:false
            })
        }
        req.id = decode.userid;
        
        // console.log(req.id);
        
        next();
    }catch(e){
        console.log(e);
        
    }
}