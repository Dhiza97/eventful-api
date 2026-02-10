import { Request, Response } from "express";
import crypto from "crypto";
import Payment from "./payment.model"
import Ticket from "../tickets/ticket.model";

export const paystackWebhook = async (req: Request, res: Response) => {
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (hash !== req.headers["x-paystack-signature"]) {
    return res.status(401).send("Invalid signature");
  }

  const event = req.body;

  if (event.event === "charge.success") {
    const reference = event.data.reference;

    // Update payment
    await Payment.findOneAndUpdate(
      { reference },
      { status: "success" }
    );

    // Activate ticket
    await Ticket.findOneAndUpdate(
      { paymentReference: reference },
      { status: "paid" }
    );
  }

  res.sendStatus(200);
};
