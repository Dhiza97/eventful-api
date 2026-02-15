import Ticket from "./ticket.model";
import { generateQRCode } from "./qr.service";

export const createTicketAfterPayment = async (
  userId: string,
  eventId: string,
  reference: string
) => {
  const existing = await Ticket.findOne({ paymentReference: reference });
  if (existing) return existing;

  // Create ticket first (without qrToken validation temporarily)
  const ticket = new Ticket({
    user: userId,
    event: eventId,
    paymentReference: reference,
    qrToken: "temp",
    status: "paid",
  });

  await ticket.save();

  const { qrToken } = await generateQRCode({
    ticketId: ticket._id.toString(),
    eventId,
    userId,
  });

  ticket.qrToken = qrToken;
  await ticket.save();

  return ticket;
};