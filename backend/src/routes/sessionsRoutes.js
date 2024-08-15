import express from "express";
import { jwtAuthMiddleware } from "../middleware/jwtAuthMiddleware.js";
import {
  createSession,
  getSessionByGameId,
} from "../controllers/sessionsController.js";

export const sessionsRouter = express.Router();

sessionsRouter.get("/:gameId", jwtAuthMiddleware, getSessionByGameId);
sessionsRouter.post("/", jwtAuthMiddleware, createSession);
