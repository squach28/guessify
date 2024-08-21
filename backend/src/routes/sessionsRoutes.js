import express from "express";
import { jwtAuthMiddleware } from "../middleware/jwtAuthMiddleware.js";
import {
  createSession,
  getSession,
} from "../controllers/sessionsController.js";

export const sessionsRouter = express.Router();

sessionsRouter.get("/", jwtAuthMiddleware, getSession);
sessionsRouter.post("/", jwtAuthMiddleware, createSession);
