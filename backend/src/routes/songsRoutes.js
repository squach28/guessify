import express from "express";
import { getTopSongs } from "../controllers/songsController.js";
import { tokenMiddleware } from "../middleware/tokenMiddleware.js";

export const songsRouter = express.Router();

songsRouter.get("/top", tokenMiddleware, getTopSongs);
