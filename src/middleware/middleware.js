import { rateLimit } from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 15, // Limit each IP to 15 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
  // store: ... , // Redis, Memcached, etc. See below.
});

export const checkApiKey = (req, res, next) => {
  const key = req.header("x-api-key");

  if (key && key === process.env.API_KEY) {
    next();
  } else {
    res.status(403).json({ error: "Access denied. Need API Key" });
  } 
};

export const logging = (req, res, next) => {
  console.log(`${req.method} ${req.url} at ${new Date().toISOString()}`);
  next();
};

// 404 error handler
export const notFoundError = (req, res, next) => {
  res.status(404).json({
    error: "We could not find the url you are looking for",
    message: `route ${req.originalUrl} not found`,
  });
};

// general error handler
export const generalError = (err, req, res, next) => {
  console.error(err.stack, "Something went wrong!");
  res.status(500).json({ error: err.name, message: err.message });
};
