import express from "express";
import {
  getAccessToken,
  signUp,
  spotifyLogin,
} from "../controllers/authController.js";

export const authRouter = express.Router();

authRouter.get("/spotify/login", spotifyLogin);
authRouter.get("/accessToken", getAccessToken);
authRouter.post("/signup", signUp);
