import { Request, RequestHandler, Response } from "express";
import { getEventAnalytics } from "./event.analytics.service";
import Event from "../events/event.model";
import Ticket from "../tickets/ticket.model";
import Payment from "../payments/payment.model";
import { AuthRequest } from "../../middlewares/auth.middleware";

interface EventParams {
  eventId: string;
}

export const eventAnalytics: RequestHandler = async (req, res) => {
  try {
    const { eventId } = req.params as { eventId: string };

    const data = await getEventAnalytics(eventId);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch event analytics",
    });
  }
};

export const creatorAnalytics = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const creatorId = req.user!.id;

    const events = await Event.find({ creator: creatorId });

    const eventIds = events.map(e => e._id);

    const tickets = await Ticket.find({ event: { $in: eventIds } });

    const payments = await Payment.find({
      event: { $in: eventIds },
      status: "success",
    });

    const totalRevenue = payments.reduce(
      (sum, p) => sum + p.amount,
      0
    );

    const revenuePerEvent = events.map(event => {
      const eventRevenue = payments
        .filter(p => p.event.toString() === event._id.toString())
        .reduce((sum, p) => sum + p.amount, 0);

      return {
        title: event.title,
        revenue: eventRevenue,
      };
    });

    const ticketsPerEvent = events.map(event => {
      const count = tickets.filter(
        t => t.event.toString() === event._id.toString()
      ).length;

      return {
        title: event.title,
        ticketsSold: count,
      };
    });

    const totalTickets = tickets.length;

    const totalCapacity = events.reduce(
      (sum, e) => sum + e.capacity,
      0
    );

    const attendanceRate =
      totalCapacity > 0
        ? (totalTickets / totalCapacity) * 100
        : 0;

    res.json({
      success: true,
      data: {
        totalEvents: events.length,
        ticketsSold: totalTickets,
        revenue: totalRevenue,
        attendanceRate,
        revenuePerEvent,
        ticketsPerEvent,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch creator analytics",
    });
  }
};