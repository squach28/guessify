import express from "express";
import { authLogin } from "../controllers/authController.js";

export const authRouter = express.Router();

authRouter.get("/login", authLogin);
