import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { connectDatabase } from "./config/db";
import authRoutes from "./modules/auth/auth.routes";
import eventRoutes from "./modules/events/event.routes";
import ticketRoutes from "./modules/tickets/ticket.routes";
import paymentRoutes from "./modules/payments/payment.routes";
import scanRoutes from "./modules/tickets/scan.routes";
import notificationRoutes from "./modules/notifications/notification.routes";
import analyticsRoutes from "./modules/analytics/analytics.routes";

// Connect to the database
connectDatabase();

const app = express();

app.use(cors());
app.use(helmet());
app.use(
  "/api/payments/webhook",
  express.raw({ type: "application/json" })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/tickets", scanRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/analytics", analyticsRoutes);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/", (_req, res) => {
  res.send("Backend is running")
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  res.status(500).json({
    message: err.message || "Internal Server Error",
  });
});

export default app;