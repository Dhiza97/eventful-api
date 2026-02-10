import { Schema, model, Document, Types } from "mongoose";

export interface ITicket extends Document {
  event: Types.ObjectId;
  user: Types.ObjectId;
  qrToken: string;
  scannedAt: Date | null;
}

const ticketSchema = new Schema<ITicket>(
  {
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    qrToken: {
      type: String,
      required: true,
      unique: true,
    },
    scannedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

export default model<ITicket>("Ticket", ticketSchema);