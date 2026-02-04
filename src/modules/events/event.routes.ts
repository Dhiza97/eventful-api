import { Router } from "express";
import * as controller from "./event.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";

const router = Router();

// Public route to get all events
router.get("/", controller.getAllEvents);

// Protected route to create a new event (only for creators)
router.post("/", authenticate, authorize("creator"), controller.createEvent);

// Protected route to get events created by the authenticated creator
router.get("/mine", authenticate, authorize("creator"), controller.getMyEvents);

export default router;