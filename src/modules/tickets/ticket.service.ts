import Ticket from "./ticket.model";
import Payment from "../payments/payment.model";
import { generateQRCode } from "./qr.service";

export const createTicketAfterPayment = async (
  userId: string,
  eventId: string,
  reference: string
) => {
  // 1. Create ticket ID manually (without saving)
  const ticket = new Ticket({
    user: userId,
    event: eventId,
    scannedAt: null
  });

  // 2. Generate QR using ticket ID
  const { qrToken, qrImage } = await generateQRCode({
    ticketId: ticket._id.toString(),
    eventId,
    userId
  });

  // 3. Attach qrToken BEFORE saving
  ticket.qrToken = qrToken;

  // 4. Save ticket (now validation passes)
  await ticket.save();

  // 5. Mark payment successful
  await Payment.findOneAndUpdate(
    { reference },
    { status: "success" }
  );

  return {
    ticketId: ticket.id,
    qrCode: qrImage
  };
};