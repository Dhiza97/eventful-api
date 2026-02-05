import rateLimit from "express-rate-limit";

export const scanLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
});