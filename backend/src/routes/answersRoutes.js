import express from "express";
import { getAnswers } from "../controllers/answersController.js";

export const answersRouter = express.Router();

answersRouter.get("/:id", getAnswers);
