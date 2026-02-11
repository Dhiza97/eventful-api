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

    const [totalTickets, totalRevenue] = await Promise.all([
      Ticket.countDocuments({ event: { $in: eventIds } }),
      Payment.aggregate([
        { $match: { event: { $in: eventIds }, status: "success" } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        totalEvents: events.length,
        totalTicketsSold: totalTickets,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch creator analytics"
    });
  }
};