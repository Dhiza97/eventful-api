import express, { Request, Response } from "express";
import { Router } from "express";
import { paystackWebhook } from "./payment.controller";

const router = Router();

const rawBodySaver = (
  req: Request & { rawBody?: Buffer },
  res: Response,
  buf: Buffer,
) => {
  if (buf && buf.length) {
    req.rawBody = buf;
  }
};

router.post(
  "/webhook",
  express.json({ verify: rawBodySaver }),
  paystackWebhook,
);

export default router;