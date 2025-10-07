import express from "express";
import {
  getMemes,
  getMemeById,
  createMeme,
  updateMeme,
  deleteMeme,
  getUserMeme,
} from "../controllers/memeController.js";

// router to hold all memes routes 
const router = express.Router();

// route to get all memes
router.get("/", getMemes);

// route to get a meme by id
router.get("/:id", getMemeById);

// route to get all user memes
router.get("/users/:id/memes", getUserMeme);

// route to add a meme
router.post("/", createMeme);

// route to update a meme by id
router.put("/:id", updateMeme);

// route to delete a meme by id
router.delete("/:id", deleteMeme);

export default router;