import { PrismaClient } from "@prisma/client";
import Joi from "joi";
import { memeSchema } from "../validation.js";
import type { Request, Response } from "express";
import type { Meme, Like } from "../types/index.js";

const likeSchema = Joi.object({
  userId: Joi.number().required(),
});

const prisma = new PrismaClient();

export const getMemes = async (req: Request, res: Response) => {
  const dbMemes = await prisma.meme.findMany();
  res.json(dbMemes);
};

export const getMemeById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const meme = await prisma.meme.findUnique({
    where: {
      id: parseInt(id as string),
    },
  });

  if (!meme) {
    throw new Error("Meme not found");
  }
  res.json(meme);
};

export const getUserMeme = async (req: Request, res: Response) => {
  const { id } = req.params;

    const userWithMemes = await prisma.user.findUnique({
      where: { id: parseInt(id as string) },
      include: { memes: true },
    });

    if (!userWithMemes) {
      throw new Error("User not found");
    }

    res.json(userWithMemes.memes);
 
};

export const createMeme = async (req: Request, res: Response) => {
  const { title, url } = req.body;
  const { error } = memeSchema.validate(req.body);
  if (error) {
    throw new Error(error?.details[0]?.message);
  };
  const newMeme = await prisma.meme.create({
    data: { title, url, userId: parseInt(req?.user?.userId as string) } as Meme,
  });


  res.status(201).json(newMeme);
};

export const updateMeme = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, url } = req.body;
  const { error } = memeSchema.validate(req.body);
  if (error) {
    throw new Error(error?.details[0]?.message)
  };

  const meme = await prisma.meme.findUnique({
    where: {
      id: parseInt(id as string),
    },
  });

  if (meme?.userId !== req?.user?.userId) {
    throw new Error("You can only update your own meme.");
  }

  const updateMeme = await prisma.meme.update({
    where: {
      id: parseInt(id as string),
    },
    data: {
      title,
      url,
    },
  });

  if (!updateMeme) {
    throw new Error("Meme not found");
  }

  res.json(updateMeme);
};

export const userLikesMeme = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const { error } = likeSchema.validate({ userId: req?.user?.userId });
  if (error) {
    throw new Error(error?.details[0]?.message)
  };

  try {
    const existing = await prisma.userLikesMeme.findUnique({
      where: {
        
        userId_memeId: { userId: parseInt(req?.user?.userId as string), memeId: parseInt(id as string)} as Like,
      },
    });

    if (existing) {
      await prisma.userLikesMeme.delete({ where: { id: existing.id } });
      return res.json({
        message: "Meme unliked",
      });
    } else {
      await prisma.userLikesMeme.create({
        
        data: { userId: parseInt(req?.user?.userId as string), memeId: parseInt(id as string) },
      });
      return res.json({
        message: "Meme liked",
      });
    }
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteMeme = async (req: Request, res: Response) => {
  const { id } = req.params;

  const meme = await prisma.meme.findUnique({
    where: {
      id: parseInt(id as string),
    },
  });

  if (meme?.userId !== req?.user?.userId) {
   throw new Error("You can only delete your own meme.");
  }

  const deleteMeme = await prisma.meme.delete({
    where: {
      id: parseInt(id as string),
    },
  });

  res.json(deleteMeme);
};
