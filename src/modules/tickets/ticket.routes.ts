import { Router } from "express";
import { buyTicket, getMyTickets } from "./ticket.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";

const router = Router();

router.post("/buy", authenticate, authorize("eventee"), buyTicket);
router.get("/my", authenticate, getMyTickets);

export default router;