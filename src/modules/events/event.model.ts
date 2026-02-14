import { Schema, model, Document, Types } from 'mongoose';

export interface IEvent extends Document {
    title: string;
    description: string;
    date: Date;
    location: string;
    price: number;
    capacity: number;
    creator: Types.ObjectId;
    reminder: number[];
    image: string;
}

const eventSchema = new Schema<IEvent>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        date: { type: Date, required: true, index: true },
        location: { type: String, required: true },
        price: { type: Number, required: true },
        capacity: { type: Number, required: true },
        creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        reminder: { type: [Number], default: [] },
        image: { type: String, default: "" },
    },
    { timestamps: true
    }
);

export default model<IEvent>('Event', eventSchema);