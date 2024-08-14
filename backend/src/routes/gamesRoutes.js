import express from "express";
import {
  createGame,
  getGamesForCurrentUser,
} from "../controllers/gamesController.js";
import { tokenMiddleware } from "../middleware/tokenMiddleware.js";
import { jwtAuthMiddleware } from "../middleware/jwtAuthMiddleware.js";

export const gamesRouter = express.Router();

gamesRouter.post("/", jwtAuthMiddleware, tokenMiddleware, createGame);
gamesRouter.get("/me", jwtAuthMiddleware, getGamesForCurrentUser);
