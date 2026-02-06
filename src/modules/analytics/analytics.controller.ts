import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { getCreatorAnalytics } from "./analytics.service";
import { getEventAnalytics } from "./event.analytics.service";

export const creatorAnalytics = async (req: AuthRequest, res: Response) => {
  const data = await getCreatorAnalytics(req.user.id);
  res.json({ data });
};

export const eventAnalytics = async (req: AuthRequest, res: Response) => {
  const { eventId } = req.params;
//   const data = await getEventAnalytics(eventId);
//   res.json({ data });
};