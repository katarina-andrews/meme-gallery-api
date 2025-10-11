import express from "express";
import memeRoutes from "./routes/memeRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// middleware to parse JSON bodies
app.use(express.json());

// middleware for logging
function logger(req, res, next) {
  console.log(`${req.method} ${req.url} at ${new Date().toISOString()}`);
  next();
}
app.use(logger);

// root route i.e homepage
app.get("/", (req, res) => {
  res.send("Welcome to the Meme Gallery API");
});

// memes routes
app.use("/memes", memeRoutes);

// user routes
app.use("/auth", authRoutes);

// 404 error handler
app.use((req, res, next) => {
  res.status(404).json({
    error: "We could not find the url you are looking for",
    message: `route ${req.originalUrl} not found`,
  });
});

// general error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`Dev Meme API listening on port http://localhost:${PORT}`);
});
