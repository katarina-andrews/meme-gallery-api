import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

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

export const createUserReg = async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: { username, password: hashedPassword },
    });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: "User already exists" });
  }
};

export const createUserLogin = async (req, res) => {
  const { username, password } = req.body;
  const user = await prisma.user.findUnique({ where: { username } });

  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ userId: user.id, role: "regular" }, "secretkey", {
    expiresIn: "1h",
  });

  res.json({ token });
};