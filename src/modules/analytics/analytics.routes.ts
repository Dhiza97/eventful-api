import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";
import {
  creatorAnalytics,
  eventAnalytics,
} from "./analytics.controller";

const router = Router();

router.get(
  "/creator",
  authenticate,
  authorize("creator"),
  creatorAnalytics
);

router.get(
  "/event/:eventId",
  authenticate,
  authorize("creator"),
  eventAnalytics
);

export default router;