import querystring from "node:querystring";
import axios from "axios";
import { generateRandomString } from "../utils/util.js";
import dotenv from "dotenv";

dotenv.config();

export const authLogin = (req, res) => {
  const state = generateRandomString(16);
  const scope = "user-top-read";
  const redirectUri = "http://localhost:3000/auth/accessToken";
  res.json({
    url:
      "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope,
        redirect_uri: redirectUri,
        state,
        show_dialog: true,
      }),
  });
};

export const getAccessToken = (req, res) => {
  const { code, state } = req.query;

  if (state == null) {
    res.redirect(
      "/#" +
        querystring.stringify({
          error: "state_mismatch",
        })
    );
  } else {
    axios
      .post(
        "https://accounts.spotify.com/api/token",
        {
          code,
          redirect_uri: "http://localhost:3000/auth/accessToken",
          grant_type: "authorization_code",
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
          },
        }
      )
      .then((result) => {
        const date = new Date();
        const hourInSeconds = 60 * 60 * 1000;
        date.setTime(date.getTime() + hourInSeconds);
        res.cookie("access_token", result.data.access_token);
        res.cookie("refresh_token", result.data.refresh_token);
        res.cookie("token_expiration_date", date);
        res.redirect("http://localhost:5173");
      });
  }
};
