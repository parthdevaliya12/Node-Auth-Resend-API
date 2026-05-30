import express, { Router } from "express";
import {
  login,
  logout,
  register,
  verifyEmailController,
} from "../controllers/user.controller.js";
import auth from "../middleware/auth.js";

const userRoutes = express.Router();

userRoutes.post("/register", register);
userRoutes.post("/verify-email", verifyEmailController);
userRoutes.post("/login", login);
userRoutes.get("/logout", auth, logout);

export default userRoutes;
