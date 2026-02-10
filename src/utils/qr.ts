import QRCode from "qrcode";
import jwt from "jsonwebtoken";

const QR_SECRET = process.env.QR_SECRET!;

export interface QrPayload {
  ticketId: string;
  eventId: string;
  userId: string;
}

export const generateQrCode = async (payload: QrPayload) => {
  // Sign payload
  const token = jwt.sign(payload, QR_SECRET, {
    expiresIn: "1d"
  });

  // Generate QR from TEXT token
  const qrCode = await QRCode.toDataURL(token);

  return {
    qrToken: token,
    qrImage: qrCode
  };
};