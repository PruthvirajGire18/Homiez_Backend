import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

/* ================= RECOMMENDED USERS ================= */
export const getRecommendedUsers = async (req, res) => {
  try {
    const userId = req.user._id;

    // Always fetch fresh user
    const currentUser = await User.findById(userId).select("friends");

    // Pending outgoing requests
    const sentRequests = await FriendRequest.find({
      sender: userId,
      status: "pending",
    }).select("receiver");

    const sentIds = sentRequests.map(r => r.receiver);

    const users = await User.find({
      _id: {
        $ne: userId,
        $nin: [...currentUser.friends, ...sentIds],
      },
      onboarded: true,
    }).select("fullname bio location profilePicture");

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching recommended users" });
  }
};

/* ================= FRIENDS ================= */
export const getMyFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("friends", "fullname bio location profilePicture");

    res.json(user.friends);
  } catch {
    res.status(500).json({ message: "Error fetching friends" });
  }
};

/* ================= SEND REQUEST ================= */
export const sendFriendRequest = async (req, res) => {
  try {
    const senderId = req.user._id;
    const receiverId = req.params.id;

    if (senderId.toString() === receiverId) {
      return res.status(400).json({ message: "Cannot send request to yourself" });
    }

    const alreadyFriend = await User.exists({
      _id: senderId,
      friends: receiverId,
    });

    if (alreadyFriend) {
      return res.status(400).json({ message: "Already friends" });
    }

    const exists = await FriendRequest.exists({
      sender: senderId,
      receiver: receiverId,
      status: "pending",
    });

    if (exists) {
      return res.status(400).json({ message: "Request already sent" });
    }

    await FriendRequest.create({ sender: senderId, receiver: receiverId });
    res.json({ message: "Friend request sent" });
  } catch {
    res.status(500).json({ message: "Error sending friend request" });
  }
};

/* ================= ACCEPT REQUEST ================= */
export const acceptFriendRequest = async (req, res) => {
  try {
    const receiverId = req.user._id;
    const senderId = req.params.id;

    const request = await FriendRequest.findOne({
      sender: senderId,
      receiver: receiverId,
      status: "pending",
    });

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = "accepted";
    await request.save();

    await User.findByIdAndUpdate(senderId, {
      $addToSet: { friends: receiverId },
    });

    await User.findByIdAndUpdate(receiverId, {
      $addToSet: { friends: senderId },
    });

    res.json({ message: "Friend request accepted" });
  } catch {
    res.status(500).json({ message: "Error accepting request" });
  }
};

/* ================= FRIEND REQUESTS ================= */
export const getFriendRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const pending = await FriendRequest.find({
      receiver: userId,
      status: "pending",
    }).populate("sender", "fullname profilePicture location");

    const accepted = await FriendRequest.find({
      receiver: userId,
      status: "accepted",
    }).populate("sender", "fullname profilePicture location");

    res.json({ pending, accepted });
  } catch {
    res.status(500).json({ message: "Error fetching friend requests" });
  }
};

/* ================= OUTGOING ================= */
export const outgoingFriendRequests = async (req, res) => {
  try {
    const requests = await FriendRequest.find({
      sender: req.user._id,
      status: "pending",
    }).populate("receiver", "fullname profilePicture location");

    res.json(requests);
  } catch {
    res.status(500).json({ message: "Error fetching outgoing requests" });
  }
};