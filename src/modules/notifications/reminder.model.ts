import { Schema, model, Document, Types } from "mongoose";
import { IUser } from "../users/user.model";
import { IEvent } from "../events/event.model";

export interface IReminder extends Document {
  user: Types.ObjectId | IUser;
  event: Types.ObjectId | IEvent;
  remindAt: Date;
  sent: boolean;
}

const reminderSchema = new Schema<IReminder>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
        remindAt: { type: Date, required: true },
        sent: { type: Boolean, default: false },
    },
    { timestamps: true }
)

export default model<IReminder>("Reminder", reminderSchema);