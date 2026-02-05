import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { scheduleReminder } from "./notification.service";

export const setReminder = async (req: AuthRequest, res: Response) => {
  const { eventId, remindAt } = req.body;

  const reminder = await scheduleReminder(
    req.user.id,
    eventId,
    new Date(remindAt)
  );

  res.status(201).json({ message: "Reminder scheduled", data: reminder });
};