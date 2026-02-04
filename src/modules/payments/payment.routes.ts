import { Router } from "express";
import { paystackWebhook } from "./payment.controller";

const router = Router();

router.post("/webhook", paystackWebhook);

export default router;