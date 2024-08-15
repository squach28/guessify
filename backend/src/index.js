import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/authRoutes.js";
import { songsRouter } from "./routes/songsRoutes.js";
import { usersRouter } from "./routes/usersRoutes.js";
import { gamesRouter } from "./routes/gamesRoutes.js";
import { answersRouter } from "./routes/answersRoutes.js";

const PORT = process.env.PORT || 3000;
const corsOptions = {
  credentials: true,
  origin: "http://localhost:5173",
};

const app = express();

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use("/auth", authRouter);
app.use("/songs", songsRouter);
app.use("/users", usersRouter);
app.use("/games", gamesRouter);
app.use("/answers", answersRouter);

app.get("/", (req, res) => {
  res.status(200).send("hello");
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
