import { IUser } from "../modules/users/user.interface";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: "creator" | "eventee";
        email: string;
      };
    }
  }
}

export {};