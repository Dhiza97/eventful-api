import { Response, RequestHandler } from "express";
import * as EventService from "./event.service";
import { AuthRequest } from "../../middlewares/auth.middleware";

export const createEvent: RequestHandler = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const event = await EventService.createEvent({
    ...req.body,
    creator: req.user!.id,
  });

  res.status(201).json({ message: "Event created", data: event });
};

export const getAllEvents: RequestHandler = async (
  _,
  res
): Promise<void> => {
  const events = await EventService.getAllEvents();
  res.json({ data: events });
};

export const getMyEvents: RequestHandler = async (
  req: AuthRequest,
  res
): Promise<void> => {
  const events = await EventService.getCreatorEvents(req.user!.id);
  res.json({ data: events });
};