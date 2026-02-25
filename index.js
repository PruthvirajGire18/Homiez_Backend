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

/* ===============================
   MIDDLEWARES
================================ */
app.use(express.json());
app.use(cookieParser());

/* ===============================
   CORS CONFIG
================================ */
const allowedOrigins = [
  "http://localhost:5173",
  "https://homiez18.netlify.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Preflight
app.options("*", cors());

/* ===============================
   ROUTES
================================ */
app.get("/", (req, res) => {
  res.json({ message: "🚀 Homiez Backend running on Vercel" });
});

app.use("/api/auth", Auth);
app.use("/api/user", User);
app.use("/api/chat", Chat);

/* ===============================
   ❌ NO app.listen() ON VERCEL
================================ */

export default app;