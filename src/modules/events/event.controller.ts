import { Response, RequestHandler } from "express";
import * as EventService from "./event.service";
import EventModel from "./event.model";
import { AuthRequest } from "../../middlewares/auth.middleware";
import redis from "../../config/redis";

const EVENT_CACHE = (id: string) => `event:${id}`;

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

export const getEventById: RequestHandler = async (req, res) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  if (redis) {
    const cached = await redis.get(EVENT_CACHE(id));
    if (cached) return res.json({ data: JSON.parse(cached) });
  }

  const event = await EventModel.findById(id).populate("creator", "name");
  if (!event) return res.status(404).json({ message: "Event not found" });

  if (redis) await redis.set(EVENT_CACHE(id), JSON.stringify(event), "EX", 300);

  res.json({ data: event });
};