import { generateStreamToken } from "../config/Stream.js";
export const generateToken=async(req,res)=>{
    try {
        const userId=req.user._id;
        const token=generateStreamToken(userId);
        res.status(200).json({token});
    } catch (error) {
        res.status(500).json({ message: "Error generating Stream token", error });
    }
}