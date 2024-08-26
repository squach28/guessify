import express from "express";
import {
  getCurrentUser,
  getUser,
  getUserById,
} from "../controllers/usersController.js";
import { jwtAuthMiddleware } from "../middleware/jwtAuthMiddleware.js";
export const usersRouter = express.Router();

usersRouter.get("/:id", getUserById);
usersRouter.get("/", getUser);
usersRouter.get("/user/me", jwtAuthMiddleware, getCurrentUser);
