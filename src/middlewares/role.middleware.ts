import { RequestHandler } from "express";
import { AuthRequest } from "./auth.middleware";

export const authorize = (
  role: "creator" | "eventee"
): RequestHandler => {
  return (req: AuthRequest, res, next) => {
    if (req.user?.role !== role) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }
    next();
  };
};