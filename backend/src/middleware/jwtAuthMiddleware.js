import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export const jwtAuthMiddleware = (req, res, next) => {
  const { access_token: accessToken } = req.cookies;
  if (accessToken === undefined) {
    res.status(400).json({ message: "Missing token" });
    return;
  }

  try {
    console.log("access token", accessToken);
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    console.log("decoded id", decoded.id);
    req.userId = decoded.id;
    next();
  } catch (e) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }
};
