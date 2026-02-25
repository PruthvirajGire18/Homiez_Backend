import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/Db.js";

import Auth from "./routes/Auth.js";
import User from "./routes/User.js";
import Chat from "./routes/Chat.js";

dotenv.config();

const app = express();

/* ===============================
   MIDDLEWARES
================================ */
app.use(express.json());
app.use(cookieParser());

/* ===============================
   CORS
================================ */
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(null, false);
    },
    credentials: true,
  })
);

/* ===============================
   ROUTES
================================ */
app.get("/", (req, res) => {
  res.json({ status: "Homiez backend running" });
});

app.use("/api/auth", Auth);
app.use("/api/user", User);
app.use("/api/chat", Chat);

/* ===============================
   DB CONNECT (SAFE)
================================ */
connectDB().catch((err) => {
  console.error("MongoDB connection failed", err);
});

/* ===============================
   EXPORT (NO app.listen)
================================ */
export default app;