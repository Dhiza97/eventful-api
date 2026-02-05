import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { setReminder } from "./notification.controller";

const router = Router();

router.post("/reminder", authenticate, setReminder);

export default router;