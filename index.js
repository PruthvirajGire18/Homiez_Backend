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
   CORS CONFIG (IMPORTANT)
================================ */
const allowedOrigins = [
  "http://localhost:5173",
  "https://homiez18.netlify.app", // ✅ your Netlify frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow server-to-server, Postman, etc.
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 🔥 Preflight fix
app.options("*", cors());

/* ===============================
   ROUTES
================================ */
app.get("/", (req, res) => {
  res.send("🚀 Homiez Backend is running");
});

app.use("/api/auth", Auth);
app.use("/api/user", User);
app.use("/api/chat", Chat);

/* ===============================
   SERVER
================================ */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});