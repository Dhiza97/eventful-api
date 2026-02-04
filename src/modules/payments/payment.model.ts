import { Schema, model, Document, Types } from "mongoose";

export interface IPayment extends Document {
  user: Types.ObjectId;
  event: Types.ObjectId;
  amount: number;
  reference: string;
  status: "pending" | "success" | "failed";
}

const paymentSchema = new Schema<IPayment>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    amount: { type: Number, required: true },
    reference: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default model<IPayment>("Payment", paymentSchema);