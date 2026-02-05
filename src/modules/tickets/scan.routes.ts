import { Router } from "express";
import { scanTicket } from "./scan.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { scanLimiter } from "../../middlewares/rateLimit.middleware";

const router = Router();

// Protected (staff / creator device)
router.post("/scan", scanLimiter, authenticate, scanTicket);

export default router;