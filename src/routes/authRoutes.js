import express from "express";
import {
  createUserReg,
  createUserLogin,
} from "../controllers/authControllers.js";
import { checkApiKey } from "../middleware/middleware.js";

const router = express.Router();

// route to create user registration
router.post("/register", checkApiKey, createUserReg);

// route to create user login
router.post("/login", checkApiKey, createUserLogin);

export default router;