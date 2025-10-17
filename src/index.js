import express from "express";
import memeRoutes from "./routes/memeRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import dotenv from "dotenv";
import {
  limiter,
  logging,
  notFoundError,
  generalError,
  checkApiKey,
} from "./middleware/middleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// middleware to parse JSON bodies
app.use(express.json());

// middleware for logging
app.use(logging);

// Apply the rate limiting middleware to all requests.
app.use(limiter);

// apply API key security to all routes
app.use(checkApiKey);

// root route i.e homepage
app.get("/", (req, res) => {
  res.send("Welcome to the Meme Gallery API");
});

// memes routes
app.use("/memes", memeRoutes);

// user routes
app.use("/auth", authRoutes);

// 404 error handler
app.use(notFoundError);

// general error handler
app.use(generalError);

app.listen(PORT, () => {
  console.log(`Dev Meme API listening on port http://localhost:${PORT}`);
});
