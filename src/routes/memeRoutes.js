import express from "express";
import {
  getMemes,
  getMemeById,
  getUserMeme,
  createMeme,
  updateMeme,
  userLikesMeme,
  deleteMeme,
} from "../controllers/memeControllers.js";
import { authenticateToken, checkApiKey } from "../middleware/middleware.js";


// router to hold all memes routes
const router = express.Router();

/**
 * A Meme type
 * @typedef {object} Meme
 * @property {number} id - Meme id
 * @property {string} title.required - The title
 * @property {string} url.required - The url
 * @property {number} userId - The user Id foreign key relationship
 */

// route to get all memes
/**
 * GET /memes
 * @summary Returns an array of Meme objects
 * @tags Memes
 * @return {array<Meme>} 200 - success response - application/json
 */

router.get("/", getMemes);

// route to get a meme by id
router.get("/:id", getMemeById);

// route to get all user memes
router.get("/users/:id/memes", getUserMeme);

// route to add a meme
/**
 * POST /memes
 * @param {Meme} request.body.required - meme info
 * @tags Memes
 * @return {object} 200 - meme response
 */

router.post("/", authenticateToken, checkApiKey, createMeme);

// route to like meme
router.post("/:id/like", authenticateToken, checkApiKey, userLikesMeme)

// route to update a meme by id
router.put("/:id", authenticateToken, checkApiKey, updateMeme);

// route to delete a meme by id
router.delete("/:id", authenticateToken, checkApiKey, deleteMeme);

export default router;