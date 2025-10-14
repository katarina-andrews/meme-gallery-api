import express from "express";
import {
  createUserReg,
  createUserLogin,
} from "../controllers/authControllers.js";

const router = express.Router();

// route to create user registration
router.post("/register", createUserReg);

// route to create user login
router.post("/login", createUserLogin);

export default router;