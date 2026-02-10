import { Request, Response } from "express";
import crypto from "crypto";
import Payment from "./payment.model";
import { createTicketAfterPayment } from "../tickets/ticket.service";

export const paystackWebhook = async (req: Request & { rawBody?: Buffer }, res: Response) => {
  const signature = req.headers["x-paystack-signature"] as string;

  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (hash !== signature) {
    return res.status(401).send("Invalid signature");
  }

  const { event, data } = req.body;

  if (event === "charge.success") {
    const payment = await Payment.findOne({ reference: data.reference });

    if (!payment) return res.sendStatus(404);

    // Prevent duplicate processing
    if (payment.status === "success") {
      return res.sendStatus(200);
    }

    // Mark payment successful
    payment.status = "success";
    await payment.save();

    // Create ticket
    await createTicketAfterPayment(
      payment.user.toString(),
      payment.event.toString(),
      payment.reference
    );
  }

  return res.sendStatus(200);
};