import express from "express";
import memeRoutes from "./routes/memeRoutes.js";
const app = express();
const PORT = 3000;

app.use(express.json());

function logger(req, res, next) {
  console.log(`${req.method} ${req.url} at ${new Date().toISOString()}`);
  next();
}
app.use(logger);

app.use("/memes", memeRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
