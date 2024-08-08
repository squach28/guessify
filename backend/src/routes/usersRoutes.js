import express from "express";
import { getUser, getUserById } from "../controllers/usersController.js";
export const usersRouter = express.Router();

usersRouter.get("/:id", getUserById);
usersRouter.get("/", getUser);
