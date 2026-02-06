import Ticket from "../tickets/ticket.model";
import Payment from "../payments/payment.model";
import redis from "../../config/redis";

export const getEventAnalytics = async (eventId: string) => {
  const cacheKey = `analytics:event:${eventId}`;
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const [sold, scanned, revenue] = await Promise.all([
    Ticket.countDocuments({ event: eventId }),
    Ticket.countDocuments({ event: eventId, scanned: true }),
    Payment.aggregate([
      { $match: { event: eventId, status: "success" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ])
  ]);

  const result = {
    ticketsSold: sold,
    ticketsScanned: scanned,
    revenue: revenue[0]?.total || 0,
    attendanceRate: sold ? (scanned / sold) * 100 : 0,
  };

  await redis.set(cacheKey, JSON.stringify(result), "EX", 300);
  return result;
};