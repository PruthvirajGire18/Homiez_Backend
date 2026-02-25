import express from "express";
import { getRecommendedUsers, getMyFriends, sendFriendRequest, acceptFriendRequest,getFriendRequests,outgoingFriendRequests} from "../controllers/User.js";
import { ProtectedRoute } from "../middlewares/Auth.js";
import { get } from "mongoose";
const router=express.Router();

router.use(ProtectedRoute);
router.get("/",getRecommendedUsers);
router.get("/friends",getMyFriends);
router.post("/addfriend/:id",sendFriendRequest);
router.put("/acceptfriend/:id/accept",acceptFriendRequest);
router.get("/getFriendRequests",getFriendRequests);
router.get("/outgoingFriendRequests",outgoingFriendRequests);
export default router;