import express from "express";
import { generateToken } from "../controllers/Chat.js";
import { ProtectedRoute } from "../middlewares/Auth.js";
const router=express.Router();

router.get("/token",ProtectedRoute,generateToken);

export default router;