import express from "express";

const app = express();
const PORT = 3000;

let memes = [
  {
    id: 1,
    title: "Distracted Boyfriend",
    url: "https://i.imgur.com/example1.jpg",
  },
  { id: 2, title: "Success Kid", url: "https://i.imgur.com/example2.jpg" },
];

// middleware
app.use(express.json());

function logger(req, res, next) {
  console.log(`${req.method} ${req.url} at ${new Date().toISOString()}`);
  next();
}
app.use(logger);

// routes
app.get("/memes", (req, res) => {
  res.json(memes);
});

app.get("/memes/:id", (req, res) => {
  const { id } = req.params;
  const meme = memes.find((m) => m.id === parseInt(id));
  if (!meme) {
    return res.status(404).json({ error: "Meme not found" });
  }
  res.json(meme);
});

app.post("/memes", async (req, res) => {
  const { title, url } = req.body;
  if (!title || !url) {
    return res.status(400).json({ error: "title and url are required" });
  }
  const newMeme = { id: memes.length + 1, title, url };
  memes.push(newMeme);
  res.status(201).json(newMeme);
});

// error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500). json({ error: "Something went wrong!" });
});

app.get("/error-test", (req, res) => {
    throw new Error("Test error");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
