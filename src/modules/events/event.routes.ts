import { Router } from "express";
import * as controller from "./event.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";

const router = Router();

// Public route to get all events
router.get("/", controller.getAllEvents);

router.post("/", authenticate, authorize("creator"), controller.createEvent);
router.get("/mine", authenticate, authorize("creator"), controller.getMyEvents);
router.get("/:id", controller.getEventById);
router.patch("/:id", authenticate, authorize("creator"), controller.updateEvent);
router.delete("/:id", authenticate, authorize("creator"), controller.deleteEvent);

export default router;