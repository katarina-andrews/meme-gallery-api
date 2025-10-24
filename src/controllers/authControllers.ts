import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userSchema } from "../validation.js";
import type { Request, Response } from "express";
import type { User } from "../types/index.js";

const prisma = new PrismaClient();

export const createUserReg = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const { error } = userSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error?.details[0]?.message });
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: { username, password: hashedPassword } as User,
    });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: "User already exists" });
  }
};

export const createUserLogin = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await prisma.user.findUnique({ where: { username } }) as User;

  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ userId: user.id, role: "regular" }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });

  res.json({ token, username, id: user.id });
};