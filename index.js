import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/Db.js";
import Auth from "./routes/Auth.js";
import User from "./routes/User.js";
import Chat from "./routes/Chat.js";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/auth", Auth);
app.use("/api/user", User);
app.use("/api/chat", Chat);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});