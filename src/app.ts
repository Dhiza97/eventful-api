import express from "express";
import cors from "cors";
import helmet from "helmet";
import { connectDatabase } from "./config/db";

// Connect to the database
connectDatabase();

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

export default app;