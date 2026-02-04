import { Response } from "express";
import crypto from "crypto";
import Payment from "./payment.model";
import { verifyPayment } from "./paystack.service";
import { createTicketAfterPayment } from "../tickets/ticket.service";

export const paystackWebhook = async (req: any, res: Response) => {
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (hash !== req.headers["x-paystack-signature"]) {
    return res.sendStatus(401);
  }

  const event = req.body.event;
  const data = req.body.data;

  if (event === "charge.success") {
    const payment = await Payment.findOne({ reference: data.reference });
    if (!payment) return res.sendStatus(404);

    await createTicketAfterPayment(
      payment.user.toString(),
      payment.event.toString(),
      payment.reference
    );
  }

  res.sendStatus(200);
};