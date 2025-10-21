import { rateLimit } from "express-rate-limit";
import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 15, // Limit each IP to 15 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
  // store: ... , // Redis, Memcached, etc. See below.
});

export const checkApiKey = (req: Request, res: Response, next: NextFunction) => {
  const key = req.header("x-api-key");

  if (key && key === process.env.API_KEY) {
    next();
  } else {
    res.status(403).json({ error: "Access denied. Need API Key" });
  } 
};

export const logging = (req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.url} at ${new Date().toISOString()}`);
  next();
};

// 404 error handler
export const notFoundError = (req: Request, res: Response) => {
  res.status(404).json({
    error: "We could not find the url you are looking for",
    message: `route ${req.originalUrl} not found`,
  });
};

// general error handler
export const generalError = (err: any, req: Request, res: Response) => {
  console.error(err.stack, "Something went wrong!");
  res.status(500).json({ error: err.name, message: err.message });
};

// middleware to authenticate user
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);
console.log(token)
  jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
    if (err) return res.sendStatus(403);
    // @ts-ignore
    req.user = decoded;
    next();
  });
}