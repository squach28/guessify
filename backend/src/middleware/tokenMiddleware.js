import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const tokenMiddleware = (req, res, next) => {
  const { token_expiration_date: expirationDate, refresh_token: refreshToken } =
    req.cookies;
  const SPOTIFY_REFRESH_TOKEN_URL = "https://accounts.spotify.com/api/token";
  const today = new Date();
  const expireDate = new Date(expirationDate);
  if (expireDate.getTime() <= today.getTime()) {
    axios
      .post(
        SPOTIFY_REFRESH_TOKEN_URL,
        {
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization:
              "Basic " +
              new Buffer.from(
                process.env.SPOTIFY_CLIENT_ID +
                  ":" +
                  process.env.SPOTIFY_CLIENT_SECRET
              ).toString("base64"),
            "Cache-Control": "max-age=0",
          },
        }
      )
      .then((result) => {
        const newExpirationDate = new Date();
        const hourInSeconds = 60 * 60 * 1000;
        newExpirationDate.setTime(newExpirationDate.getTime() + hourInSeconds);
        const newAccessToken = result.data.access_token;
        res.cookie("access_token", newAccessToken);
        res.cookie("token_expiration_date", newExpirationDate);
      })
      .catch((e) => console.log("error"));
  }
  next();
};
