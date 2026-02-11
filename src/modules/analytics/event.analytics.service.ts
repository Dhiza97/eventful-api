import Ticket from "../tickets/ticket.model";
import Payment from "../payments/payment.model";
import redis from "../../config/redis";
import mongoose from "mongoose";

export const getEventAnalytics = async (eventId: string) => {
  const cacheKey = `analytics:event:${eventId}`;

  if (redis) {
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);
  }

  const objectId = new mongoose.Types.ObjectId(eventId);

  const [ticketsSold, ticketsScanned, revenueAgg] = await Promise.all([
    Ticket.countDocuments({ event: objectId }),
    Ticket.countDocuments({ event: objectId, scannedAt: { $ne: null } }),
    Payment.aggregate([
      { $match: { event: objectId, status: "success" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ])
  ]);

  const revenue = revenueAgg[0]?.total || 0;
  const attendanceRate = ticketsSold ? (ticketsScanned / ticketsSold) * 100 : 0;

  const result = {
    ticketsSold,
    ticketsScanned,
    revenue,
    attendanceRate,
  };

  if (redis) {
    await redis.set(cacheKey, JSON.stringify(result), "EX", 300);
  }

  return result;
};