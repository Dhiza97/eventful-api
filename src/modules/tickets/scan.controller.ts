import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import Ticket from "./ticket.model";
import redis from "../../config/redis";

export const scanTicket = async (req: Request, res: Response) => {
  const { qrCode } = req.body;

  if (!qrCode || typeof qrCode !== "string") {
    return res.status(400).json({ message: "Invalid QR code" });
  }

  let decoded: any;

  try {
    decoded = jwt.verify(qrCode, process.env.QR_SECRET!);
  } catch {
    return res.status(401).json({ message: "Invalid or expired QR code" });
  }

  const { ticketId } = decoded;

  const redisKey = `ticket:scanned:${ticketId}`;

  // Redis fast check
  const alreadyScanned = await redis?.get(redisKey);
  if (alreadyScanned) {
    return res.status(409).json({ message: "Ticket already scanned" });
  }

  // DB check
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found" });
  }

  if (ticket.scannedAt) {
    return res.status(409).json({ message: "Ticket already used" });
  }

  // Mark scanned
  ticket.scannedAt = new Date();
  await ticket.save();

  await redis?.set(redisKey, "true");

  return res.json({
    message: "Access granted",
    ticketId,
  });
};