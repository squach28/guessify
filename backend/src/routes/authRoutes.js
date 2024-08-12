import express from "express";
import {
  connectedWithSpotify,
  getAccessToken,
  logIn,
  logOut,
  signUp,
  spotifyLogin,
} from "../controllers/authController.js";
import { jwtAuthMiddleware } from "../middleware/jwtAuthMiddleware.js";

export const authRouter = express.Router();

authRouter.get("/spotify/connected", jwtAuthMiddleware, connectedWithSpotify);
authRouter.get("/spotify/login", jwtAuthMiddleware, spotifyLogin);
authRouter.get("/accessToken", getAccessToken);
authRouter.post("/signup", signUp);
authRouter.post("/login", logIn);
authRouter.post("/logout", logOut);
