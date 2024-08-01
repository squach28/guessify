import express from "express";
import { authRouter } from "./routes/authRoutes.js";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.status(200).send("hello");
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
