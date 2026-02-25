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
   BASIC MIDDLEWARES
================================ */
app.use(express.json());
app.use(cookieParser());

/* ===============================
   CORS (SERVERLESS SAFE)
================================ */
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow server-to-server, Postman, or same-origin requests (no origin)
      if (!origin) return callback(null, true);

      // If CLIENT_URL is missing from env or the origin is in allowlist,
      // echo back the origin so browsers accept credentialed requests.
      if (allowedOrigins.includes(origin)) {
        return callback(null, origin);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

/* ===============================
   ROUTES
================================ */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Homiez backend running 🚀",
  });
});

app.use("/api/auth", Auth);
app.use("/api/user", User);
app.use("/api/chat", Chat);

/* ===============================
   404 HANDLER (NO *)
================================ */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* ===============================
   DB CONNECT (SERVERLESS SAFE)
================================ */
connectDB()
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

export default app;