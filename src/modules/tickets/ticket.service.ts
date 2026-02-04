import Ticket from "./ticket.model";
import Payment from "../payments/payment.model";
import { generateQRCode } from "./qr.service";

export const createTicketAfterPayment = async (
  userId: string,
  eventId: string,
  reference: string
) => {
  const qrData = `${eventId}:${userId}:${reference}`;
  const qrCode = await generateQRCode(qrData);

  const ticket = await Ticket.create({
    user: userId,
    event: eventId,
    qrCode,
  });

  await Payment.findOneAndUpdate(
    { reference },
    { status: "success" }
  );

  return ticket;
};