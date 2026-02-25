import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const ProtectedRoute=async(req,res,next)=>{
    try {
        let token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        if(!token){
            return res.status(401).json({message:"Unauthorized"});
        }

        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const user=await User.findById(decoded.userId).select("-password");
        req.user=user;
        next();
    } catch (error) {
        console.log("Unauthorised error ",error);
        return res.status(401).json({message:"Unauthorized"});
    }
}