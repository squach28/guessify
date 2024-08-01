import express from "express";
import { authLogin, getAccessToken } from "../controllers/authController.js";

export const authRouter = express.Router();

authRouter.get("/login", authLogin);
authRouter.get("/accessToken", getAccessToken);
