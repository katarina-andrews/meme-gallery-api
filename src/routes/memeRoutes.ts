import express from "express";
import type { Request, Response, NextFunction } from "express"
import {
  getMemes,
  getMemeById,
  getUserMeme,
  createMeme,
  updateMeme,
  userLikesMeme,
  deleteMeme,
} from "../controllers/memeControllers.js";
import jwt from "jsonwebtoken";


// router to hold all memes routes
const router = express.Router();

// middleware to authenticate user
function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);
console.log(token)
  jwt.verify(token, process.env.JWT_SECRET!, (err: any, decoded) => {
    if (err) return res.sendStatus(403);
    // @ts-ignore
    req.user = decoded;
    next();
  });
}

// route to get all memes
router.get("/", getMemes);

// route to get a meme by id
router.get("/:id", getMemeById);

// route to get all user memes
router.get("/users/:id/memes", getUserMeme);

// route to add a meme
router.post("/", authenticateToken, createMeme);

// route to like meme
router.post("/:id/like", authenticateToken, userLikesMeme)

// route to update a meme by id
router.put("/:id", authenticateToken, updateMeme);

// route to delete a meme by id
router.delete("/:id", authenticateToken, deleteMeme);

export default router;