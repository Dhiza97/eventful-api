import { Schema, model, Document } from "mongoose";

export type UserRole = "creator" | "eventee";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["creator", "eventee"], required: true },
  },
  { timestamps: true }
);

export default model<IUser>("User", userSchema);