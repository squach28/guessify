import querystring from "node:querystring";
import axios from "axios";
import { generateRandomString } from "../utils/util.js";
import dotenv from "dotenv";

dotenv.config();

export const authLogin = (req, res) => {
  const state = generateRandomString(16);
  const scope = "user-top-read";
  const redirectUri = "http://localhost:3000/auth/accessToken";
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope,
        redirect_uri: redirectUri,
        state,
      })
  );
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
        res.status(200).json(result.data);
      });
  }
};
