import Limiter from "express-rate-limit";

export function putlimit(time:number,times:number) {
  const limiter = Limiter({
      windowMs: time * 60 * 1000, // 15 minutes
      limit: times, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
      standardHeaders: "draft-8", 
      legacyHeaders: false, 
    });
    return limiter;
}

export const limiter = Limiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-8", 
  legacyHeaders: false, 
});