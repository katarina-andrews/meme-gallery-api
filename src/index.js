import express from "express";
import memeRoutes from "./routes/memeRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import dotenv from "dotenv";
import {
  limiter,
  logging,
  notFoundError,
  generalError,
} from "./middleware/middleware.js";
import expressJSDocSwagger from "express-jsdoc-swagger";
import cors from "cors"; 

dotenv.config();

const app = express();
const PORT = process.env.PORT;

expressJSDocSwagger(app)({
  info: {
    version: "1.0.0",
    title: "Meme Gallery API",
    description: "Docs for Meme Gallery API",
  },
  security: { ApiKeyAuth: { type: "apiKey", in: "header", name: "x-api-key" } },
  swaggerUIPath: "/docs",
  baseDir: process.cwd(), // returns the current working directory
  filesPattern: "./src/routes/**/*.{js,ts}",
  exposeApiDocs: true,
  apiDocsPath: "/api-docs.json",
});

app.use(cors())

// middleware to parse JSON bodies
app.use(express.json());

// middleware for logging
app.use(logging);

// Apply the rate limiting middleware to all requests.
app.use(limiter);

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
