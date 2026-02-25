import express from "express";
import { signup,login,logout,onBoarding} from "../controllers/Auth.js";
import { ProtectedRoute } from "../middlewares/Auth.js";
const router=express.Router();

router.post("/signup",signup);
router.post("/login",login);
router.post("/logout",logout);
router.post("/onboarding",ProtectedRoute,onBoarding);

router.get("/me",ProtectedRoute,(req,res)=>{
    res.status(200).json({user:req.user});
})


export default router;