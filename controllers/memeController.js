import { PrismaClient } from "@prisma/client";
import Joi from "joi"; 

const likeSchema = Joi.object({
  userId: Joi.number().required(),
});

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
      include: { memes: true },
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
  const { title, url } = req.body;
  if (!title || !url) {
    return res.status(400).json({ error: "title and url are required" });
  }

  const newMeme = await prisma.meme.create({
    data: { title, url, userId: req.user.userId },
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

export const userLikesMeme = async (req, res) => {
  const { id } = req.params;
  const { error } = likeSchema.validate({ userId: req.user.userId }); 
  if (error) return res.status(400).json({ error: error.details[0].message }); 

  try {
    const existing = await prisma.userLikesMeme.findUnique({
      where: {
        userId_memeId: { userId: req.user.userId, memeId: parseInt(id) },
      },
    });

    if (existing) {
      await prisma.userLikesMeme.delete({ where: { id: existing.id } });
      return res.json({ message: "Meme unliked" });
    } else {
      await prisma.userLikesMeme.create({
        data: { userId: req.user.userId, memeId: parseInt(id) },
      });
      return res.json({ message: "Meme liked" });
    }
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
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


