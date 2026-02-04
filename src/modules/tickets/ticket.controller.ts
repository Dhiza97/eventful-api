import { Response } from "express";
import { initializePayment } from "../payments/paystack.service";
import Payment from "../payments/payment.model";
import { AuthRequest } from "../../middlewares/auth.middleware";
import crypto from "crypto";

export const buyTicket = async (req: AuthRequest, res: Response) => {
  const { eventId, amount } = req.body;

  const reference = crypto.randomUUID();

  await Payment.create({
    user: req.user.id,
    event: eventId,
    amount,
    reference,
  });

  const payment = await initializePayment(
    req.user.email,
    amount,
    reference
  );

  res.json({ data: payment });
};