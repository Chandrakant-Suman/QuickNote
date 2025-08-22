import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();
const __dirname = path.resolve();

// middleware
app.use(cors()); // let Vercel handle domains, no need for localhost check
app.use(express.json());
app.use(rateLimiter);

app.use("/api/notes", notesRoutes);

// Serve frontend in production (optional, if you’re also deploying frontend on Vercel, you may remove this block)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// ✅ Connect DB before export
await connectDB();

// 🚀 Instead of app.listen(), just export app
export default app;
