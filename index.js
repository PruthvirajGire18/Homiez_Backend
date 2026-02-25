import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/Db.js";

import Auth from "./routes/Auth.js";
import User from "./routes/User.js";
import Chat from "./routes/Chat.js";

/* ===============================
   ENV CONFIG
================================ */
dotenv.config();

const app = express();

/* ===============================
   MIDDLEWARES
================================ */
app.use(express.json());
app.use(cookieParser());

/* ===============================
   CORS CONFIG (SERVERLESS SAFE)
================================ */
const allowedOrigins = [
  "http://localhost:5173",          // local dev
  process.env.CLIENT_URL,           // netlify prod
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow server-to-server, Postman, etc.
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    credentials: true,
  })
);

/* ===============================
   ROUTES
================================ */
app.get("/", (req, res) => {
  res.json({ status: "Homiez backend running 🚀" });
});

app.use("/api/auth", Auth);
app.use("/api/user", User);
app.use("/api/chat", Chat);

/* ===============================
   DATABASE CONNECTION
   (SERVERLESS SAFE)
================================ */
connectDB()
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection failed:", err));

/* ===============================
   EXPORT FOR VERCEL
   (NO app.listen)
================================ */
export default app;