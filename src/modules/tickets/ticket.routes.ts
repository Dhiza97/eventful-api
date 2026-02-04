import { Router } from "express";
import { buyTicket } from "./ticket.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";

const router = Router();

router.post("/buy", authenticate, authorize("eventee"), buyTicket);

export default router;