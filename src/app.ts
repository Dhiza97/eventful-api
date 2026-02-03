import express from "express";
import cors from "cors";
import helmet from "helmet";
import { connectDatabase } from "./config/db";
import authRoutes from "./modules/auth/auth.routes";

// Connect to the database
connectDatabase();

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

export default app;