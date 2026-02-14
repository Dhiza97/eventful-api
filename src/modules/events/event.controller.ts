import { Response, RequestHandler } from "express";
import * as EventService from "./event.service";
import EventModel from "./event.model";
import Ticket from "../tickets/ticket.model";
import { AuthRequest } from "../../middlewares/auth.middleware";
import redis from "../../config/redis";
import { fetchEventImage } from "../../utils/unsplash";

const EVENT_CACHE = (id: string) => `event:${id}`;

export const createEvent: RequestHandler = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  const imageUrl = await fetchEventImage(req.body.title);

  const event = await EventService.createEvent({
    ...req.body,
    creator: req.user!.id,
    image: imageUrl,
  });

  res.status(201).json({ message: "Event created", data: event });
};

export const getAllEvents: RequestHandler = async (_, res): Promise<void> => {
  const events = await EventService.getAllEvents();
  res.json({ data: events });
};

export const getMyEvents: RequestHandler = async (
  req: AuthRequest,
  res,
): Promise<void> => {
  const events = await EventModel.find({ creator: req.user!.id });

  const eventIds = events.map((e) => e._id);

  const tickets = await Ticket.aggregate([
    {
      $match: { event: { $in: eventIds } },
    },
    {
      $group: {
        _id: "$event",
        count: { $sum: 1 },
      },
    },
  ]);

  const ticketMap = new Map(tickets.map((t) => [t._id.toString(), t.count]));

  const eventsWithTickets = events.map((event) => ({
    ...event.toObject(),
    ticketsSold: ticketMap.get(event._id.toString()) || 0,
  }));

  res.json({ data: eventsWithTickets });
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

export const updateEvent: RequestHandler = async (req: AuthRequest, res) => {
  try {
    const eventId = req.params.id;
    const updates = req.body;

    const event = await EventModel.findOneAndUpdate(
      { _id: eventId, creator: req.user!.id },
      updates,
      { new: true }
    );

    if (!event) return res.status(404).json({ message: "Event not found" });

    res.json({ message: "Event updated", data: event });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update event" });
  }
};

export const deleteEvent: RequestHandler = async (req: AuthRequest, res) => {
  try {
    const eventId = req.params.id;

    const event = await EventModel.findOneAndDelete({
      _id: eventId,
      creator: req.user!.id,
    });

    if (!event) return res.status(404).json({ message: "Event not found" });

    res.json({ message: "Event deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete event" });
  }
};