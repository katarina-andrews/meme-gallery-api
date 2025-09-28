let memes = [
  {
    id: 1,
    title: "Distracted Boyfriend",
    url: "https://i.imgur.com/example1.jpg",
  },
  { id: 2, title: "Success Kid", url: "https://i.imgur.com/example2.jpg" },
];

export const getMemes = (req, res) => {
  res.json(memes);
};

export const getMemeById = (req, res) => {
  const { id } = req.params;
  const meme = memes.find((m) => m.id === parseInt(id));
  if (!meme) {
    return res.status(404).json({ error: "Meme not found" });
  }
  res.json(meme);
};

export const createMeme = (req, res) => {
  const { title, url } = req.body;
  if (!title || !url) {
    return res.status(400).json({ error: "title and url are required" });
  }
  const newMeme = { id: memes.length + 1, title, url };
  memes.push(newMeme);
  res.status(201).json(newMeme);
};

export const updateMeme = (req, res) => {
  const { id } = req.params;
  const { title, url } = req.body;
  const meme = memes.find((m) => m.id === parseInt(id));

  if (!meme) {
    return res.status(404).json({ error: "Meme not found" });
  }
  meme.title = title || meme.title;
  meme.url = url || meme.url;

  res.json(meme);
};

export const deleteMeme = (req, res) => {
  const { id } = req.params;
  const index = memes.findIndex((m) => m.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ error: "Meme not found" });
  }

  const deleted = memes.splice(index, 1);
  res.json(deleted[0]);
};
