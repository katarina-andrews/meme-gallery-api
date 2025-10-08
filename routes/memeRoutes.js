import express from "express";
import {
  getMemes,
  getMemeById,
  createMeme,
  updateMeme,
  deleteMeme,
} from "../controllers/memeController.js";
import { getUserMeme } from "../controllers/userController.js";
import jwt from "jsonwebtoken";

// router to hold all memes routes
const router = express.Router();

// middleware to authenticate user
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, "secretkey", (err, decoded) => {
    if (err) return res.sendStatus(403);
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

// route to update a meme by id
router.put("/:id", updateMeme);

// route to delete a meme by id
router.delete("/:id", deleteMeme);

export default router;