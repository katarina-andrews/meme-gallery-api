import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getMemes = async (req, res) => {
  const dbMemes = await prisma.meme.findMany();
  res.json(dbMemes);
};

export const getMemeById = async (req, res) => {
  const { id } = req.params;

  const meme = await prisma.meme.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!meme) {
    return res.status(404).json({ error: "Meme not found" });
  }
  res.json(meme);
};

export const getUserMeme = async (req, res) => {
  const { id } = req.params;

  try {
    const userWithMemes = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: { memes: true }
    });

    if (!userWithMemes) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(userWithMemes.memes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const createMeme = async (req, res) => {
  const { title, url, userId } = req.body;
  if (!title || !url) {
    return res.status(400).json({ error: "title and url are required" });
  }

  const newMeme = await prisma.meme.create({
    data: { title, url, userId },
  });

  res.status(201).json(newMeme);
};

export const updateMeme = async (req, res) => {
  const { id } = req.params;
  const { title, url } = req.body;

  const updateMeme = await prisma.meme.update({
    where: {
      id: parseInt(id),
    },
    data: {
      title,
      url,
    },
  });

  if (!updateMeme) {
    return res.status(404).json({ error: "Meme not found" });
  }

  res.json(updateMeme);
};

export const deleteMeme = async (req, res) => {
  const { id } = req.params;

  const deleteMeme = await prisma.meme.delete({
    where: {
      id: parseInt(id),
    },
  });

  res.json(deleteMeme);
};
