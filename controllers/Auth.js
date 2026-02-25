import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createStreamUser } from "../config/Stream.js";

// common cookie options
const cookieOptions = {
  httpOnly: true,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  sameSite: "lax",      // 🔥 MUST
  secure: false,
  path: "/",        // 🔥 localhost
};

// ================= SIGNUP =================
export const signup = async (req, res) => {
  try {
    let { fullname, email, password } = req.body;

    // validations
    if (!fullname || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    email = email.toLowerCase();

    // check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // profile picture
    const idx = Math.floor(Math.random() * 100) + 1;
    const profilePicture = `https://avatar.iran.liara.run/public/${idx}.png`;

    // create user
    const newUser = await User.create({
      fullname,
      email,
      password: hashedPassword,
      profilePicture,
    });

    // create stream user (non-blocking best practice)
    await createStreamUser({
      id: newUser._id.toString(),
      name: newUser.fullname,
      image: newUser.profilePicture,
    }).catch((err) => console.error("Stream error:", err));

    // jwt
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, cookieOptions);

    // remove password before sending response
    const { password: _, ...userData } = newUser._doc;

    return res.status(201).json({
      message: "User created successfully",
      user: userData,
      token,
    });
  } catch (error) {
    console.error("signup controller error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    email = email.toLowerCase();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, cookieOptions);

    // remove password
    const { password: _, ...userData } = user._doc;

    return res.status(200).json({
      message: "User logged in successfully",
      user: userData,
      token,
    });
  } catch (error) {
    console.error("login controller error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ================= LOGOUT =================
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", cookieOptions);
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("logout controller error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const onBoarding = async (req, res) => {
  try {
    const user=req.user;
    if(!user){
      return res.status(400).json({message:"User not found"});
    }
    const {fullname,bio,location}=req.body;
    if(!fullname || !bio || !location){
      return res.status(400).json({message:"All fields are required"});
    }

    const updatedUser=await User.findByIdAndUpdate(user._id,{
      fullname,
      bio,
      location,
      onboarded:true,
    },{new:true});

    if(!updatedUser){
      return res.status(400).json({message:"User not found"});
    }
    try {
      await createStreamUser({
        id:updatedUser._id.toString(),
        name:updatedUser.fullname,
        image:updatedUser.profilePicture || "",
      });
      console.log("Stream user updated after onboarding:",updatedUser.fullname);
      
    } catch (error) {
      console.log("upsert stream user while onboarding ",error);
      return res.status(500).json({message:"Internal server error"});
    }

    return res.status(200).json({
      message:"User updated successfully",
      user:updatedUser,
    });

  } catch (error) {
    console.log("Onboarding error ",error);
    return res.status(500).json({message:"Internal server error"});
  }
}