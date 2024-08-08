import dotenv from "dotenv";

dotenv.config();

export const jwtAuthMiddleware = (req, res, next) => {
  const { access_token: accessToken } = req.cookies;
  if (accessToken === undefined) {
    res
      .status(403)
      .json({ message: "You don't have permission to access this." });
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    req.userId = decoded.id;
    next();
  } catch (e) {
    res.status(400).json({ error: "Invalid token" });
  }
};
