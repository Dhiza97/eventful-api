import { Schema, model, Document, Types } from "mongoose";

export interface ITicket extends Document {
  event: Types.ObjectId;
  user: Types.ObjectId;
  qrCode: string;
  scanned: boolean;
}

const ticketSchema = new Schema<ITicket>(
  {
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    qrCode: { type: String, required: true },
    scanned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default model<ITicket>("Ticket", ticketSchema);