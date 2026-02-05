import { Request, Response } from "express";
import Ticket from "./ticket.model";
import redis from "../../config/redis";

export const scanTicket = async (req: Request, res: Response) => {
  const { qrData } = req.body;

  const [eventId, userId] = qrData.split(":");
  const redisKey = `qr:${eventId}:${userId}`;

  // 1. Redis lock (fast)
  const redisHit = await redis.get(redisKey);
  if (redisHit) {
    return res.status(409).json({ message: "Ticket already scanned" });
  }

  // 2. DB check (source of truth)
  const ticket = await Ticket.findOne({ event: eventId, user: userId });
  if (!ticket) {
    return res.status(404).json({ message: "Invalid ticket" });
  }

  if (ticket.scanned) {
    return res.status(409).json({ message: "Ticket already used" });
  }

  // 3. Lock in Redis (temporary)
  await redis.set(redisKey, "scanned", "EX", 60 * 60 * 24);

  // 4. Persist scan
  ticket.scanned = true;
  await ticket.save();

  return res.json({ message: "Access granted" });
};