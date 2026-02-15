import { Request, Response } from "express";
import crypto from "crypto";
import Payment from "./payment.model";
import { createTicketAfterPayment } from "../tickets/ticket.service";
import { verifyPayment } from "./paystack.service";
import Event from "../events/event.model";

// Paystack Webhook
export const paystackWebhook = async (
  req: Request,
  res: Response
) => {
  const signature = req.headers["x-paystack-signature"] as string;

  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
    .update(req.body as Buffer)
    .digest("hex");

  if (hash !== signature) {
    return res.status(401).send("Invalid signature");
  }

  const parsedBody = JSON.parse((req.body as Buffer).toString());

   const { event, data } = parsedBody;

  if (event === "charge.success") {
    const payment = await Payment.findOne({ reference: data.reference });

    if (!payment) return res.sendStatus(404);

    // Prevent duplicate processing
    if (payment.status === "success") {
      return res.sendStatus(200);
    }

    payment.status = "success";
    payment.paidAt = new Date();
    await payment.save();

    // Create ticket safely
    await createTicketAfterPayment(
      payment.user.toString(),
      payment.event.toString(),
      payment.reference
    );
  }

  return res.sendStatus(200);
};

export const verifyPaymentController = async (req: Request, res: Response) => {
  const reference = req.params.reference as string;

  const paystackResponse = await verifyPayment(reference);

  if (paystackResponse.status !== "success") {
    return res.status(400).json({ message: "Payment not successful" });
  }

  const payment = await Payment.findOne({ reference });

  if (!payment) {
    return res.status(404).json({ message: "Payment not found" });
  }

  if (payment.status !== "success") {
    payment.status = "success";
    payment.paidAt = new Date();
    await payment.save();

    await createTicketAfterPayment(
      payment.user.toString(),
      payment.event.toString(),
      payment.reference
    );
  }

  res.json({ success: true });
};