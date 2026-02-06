import Event from "../events/event.model";
import Ticket from "../tickets/ticket.model";
import Payment from "../payments/payment.model";
import redis from "../../config/redis";

const CACHE_TTL = 300;

export const getCreatorAnalytics = async (creatorId: string) => {
  const cacheKey = `analytics:creator:${creatorId}`;

  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const events = await Event.find({ creator: creatorId }).select("_id");
  const eventIds = events.map(e => e._id);

  const [ticketsSold, scans, revenue] = await Promise.all([
    Ticket.countDocuments({ event: { $in: eventIds } }),
    Ticket.countDocuments({ event: { $in: eventIds }, scanned: true }),
    Payment.aggregate([
      { $match: { event: { $in: eventIds }, status: "success" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ])
  ]);

  const result = {
    totalEvents: eventIds.length,
    totalTicketsSold: ticketsSold,
    totalScans: scans,
    totalRevenue: revenue[0]?.total || 0,
  };

  await redis.set(cacheKey, JSON.stringify(result), "EX", CACHE_TTL);
  return result;
};