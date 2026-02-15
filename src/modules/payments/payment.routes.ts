import express from "express";
import { Router } from "express";
import { paystackWebhook, verifyPaymentController } from "./payment.controller";

const router = Router();

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  paystackWebhook
);

router.get("/verify/:reference", verifyPaymentController);

export default router;