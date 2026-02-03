import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

export const authorize = 
    (role: "creator" | "eventee") => {
        (req: AuthRequest, res: Response, next: NextFunction) => {
            if (req.user?.role !== role) {
                return res.status(403).json({ message: "Forbidden" });
            }
            next();
        }
    }