import { Response, Request } from "express";
import crypto from "crypto";
import { AuthRequest } from "../../middlewares/auth.middleware";
import Event from "../events/event.model";
import Payment from "../payments/payment.model";
import { initializePayment } from "../payments/paystack.service";
import User from "../users/user.model";
import Ticket from "./ticket.model";

export const buyTicket = async (req: AuthRequest, res: Response) => {
  const { eventId } = req.body;

  // Fetch event
  const event = await Event.findById(eventId);
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  const user = await User.findById(req.user.id);
  if (!user || !user.email) {
    return res.status(400).json({ message: "User email not found" });
  }

  const reference = crypto.randomUUID();

  // Create pending payment (amount comes from event)
  await Payment.create({
    user: req.user.id,
    event: event._id,
    amount: event.price,
    reference,
    status: "pending",
  });

  // Initialize Paystack
  const payment = await initializePayment(
    user.email,
    event.price,
    reference
  );

  return res.status(200).json({
    authorization_url: payment.authorization_url,
    reference,
  });
};

export const getMyTickets = async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const tickets = await Ticket.find({ user: userId })
    .populate("event", "title date location");

  res.status(200).json({
    success: true,
    count: tickets.length,
    data: tickets
  });
};