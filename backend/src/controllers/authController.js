import querystring from "node:querystring";
import axios from "axios";
import { generateRandomString } from "../utils/util.js";
import dotenv from "dotenv";
import { commitTransaction, db } from "../utils/db.js";
import { queries } from "../utils/queries.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { storage } from "../utils/firebase.js";
import { getDownloadURL } from "firebase-admin/storage";

dotenv.config();

const SALT_ROUNDS = 10;

export const connectedWithSpotify = (req, res) => {
  const userId = req.userId;

  db.query(queries.getUserById, [userId], (err, result) => {
    if (err) throw err;
    if (result.rowCount === 0) {
      res.status(404).json({ message: `User doesn't exist` });
    }
    const { spotify_id: spotifyId } = result.rows[0];
    if (spotifyId === null) {
      res.status(200).json({ connected: false });
      return;
    } else {
      res.status(200).json({ connected: true });
      return;
    }
  });
};

export const spotifyLogin = (req, res) => {
  const state = generateRandomString(16);
  const userId = req.userId;
  db.query(
    queries.updateSpotifyStateByUserId,
    [state, userId],
    (err, result) => {
      if (err) throw err;
      const scope = "user-top-read user-read-email";
      const redirectUri = `${process.env.REDIRECT_URI}/auth/accessToken`;
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
    }
  );
};

export const getAccessToken = async (req, res) => {
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
          redirect_uri: `${process.env.REDIRECT_URI}/auth/accessToken`,
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
        const { access_token: accessToken, refresh_token: refreshToken } =
          result.data;
        date.setTime(date.getTime() + hourInSeconds);
        db.query(queries.getUserIdBySpotifyState, [state], (err, result) => {
          if (err) throw err;
          const { id: userId } = result.rows[0];
          getSpotifyId(accessToken).then((spotifyId) => {
            commitTransaction(db, queries.updateSpotifyIDByUserId, [
              spotifyId,
              userId,
            ]);
            commitTransaction(db, queries.updateSpotifyStateByUserId, [
              null,
              userId,
            ]);
            commitTransaction(db, queries.updateSpotifyRefreshTokenByUserId, [
              refreshToken,
              userId,
            ]);
          });
          res.cookie("spotify_access_token", accessToken);
          res.cookie("spotify_token_expiration_date", date);
          res.cookie("spotify_refresh_token", refreshToken);
          res.redirect(`${process.env.CORS_ORIGIN}/home`);
        });
      });
  }
};

const getSpotifyId = async (accessToken) => {
  const SPOTIFY_CURRENT_USER_ENDPOINT = "https://api.spotify.com/v1/me";
  return axios
    .get(SPOTIFY_CURRENT_USER_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => {
      return res.data.id;
    });
};

const updateSpotifyIdByUserId = async (userId, spotifyId) => {
  db.query(updateSpotifyIdByUserId, [spotifyId, userId], (err, result) => {
    if (err) throw err;
    console.log(result);
  });
};

const createUser = async (id, username, email) => {
  const file = storage.file("default_image_url.jpg");
  return getDownloadURL(file).then((imageUrl) => {
    db.query(
      queries.createUser,
      [id, username, email, imageUrl],
      (err, result) => {
        if (err) throw err;
        console.log(result);
      }
    );
  });
};

export const signUp = (req, res) => {
  const { username, email, password } = req.body;
  if (username === undefined || email === undefined || password === undefined) {
    res.status(400).json({
      message: "Request body is missing username, email, or password.",
    });
    return;
  }

  db.query(queries.getUserByUsernameAuth, [username], (err, result) => {
    if (err) throw err;
    if (result.rowCount > 0) {
      res.status(400).json({ message: `${email} is already taken` });
    } else {
      bcrypt.genSalt(SALT_ROUNDS, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) throw err;
          db.query(queries.signup, [email, username, hash], (err, result) => {
            if (err) throw err;
            const { id } = result.rows[0];
            createUser(id, username, email).then(() => {
              console.log("auth user id", id);
              const accessToken = jwt.sign(
                { id, username },
                process.env.JWT_SECRET,
                {
                  expiresIn: "1 day",
                }
              );
              res.cookie("access_token", accessToken, {
                httpOnly: true,
              });
              res.status(201).json({ id });
              return;
            });
          });
        });
      });
    }
  });
};

export const logIn = (req, res) => {
  const { username, password } = req.body;
  if (username === undefined || password === undefined) {
    res.status(400).json({
      message: "Request body is missing username or password.",
    });
    return;
  }

  db.query(queries.getUserByUsernameAuth, [username], (err, result) => {
    if (err) throw err;
    if (result.rowCount === 0) {
      res.status(404).json({
        type: "USER_DOES_NOT_EXIST",
        message: `User with username ${username} doesn't exist`,
      });
      return;
    }
    const id = result.rows[0].id;
    const hashedPassword = result.rows[0].password;
    bcrypt.compare(password, hashedPassword, (err, match) => {
      if (err) throw err;
      if (match) {
        const accessToken = jwt.sign({ id, username }, process.env.JWT_SECRET, {
          expiresIn: "1 day",
        });
        res.cookie("access_token", accessToken, {
          httpOnly: true,
          sameSite: "none",
          secure: true,
        });
        const spotifyRefreshToken = result.rows[0].spotify_refresh_token;
        if (spotifyRefreshToken === null) {
          res.status(200).json({ message: "Success" });
          return;
        }
        getAccessTokenWithRefreshToken(spotifyRefreshToken)
          .then((result) => {
            const spotifyAccessToken = result.data.access_token;

            const date = new Date();
            const hourInSeconds = 60 * 60 * 1000;
            date.setTime(date.getTime() + hourInSeconds);

            res.cookie("spotify_access_token", spotifyAccessToken);
            res.cookie("spotify_token_expiration_date", date);
            res.cookie("spotify_refresh_token", spotifyRefreshToken);
            res.status(200).json({ message: "Success" });
            return;
          })
          .catch((e) =>
            console.log(
              "Something went wrong with trying to get access token from refresh token :("
            )
          );
      } else {
        res
          .status(400)
          .json({ type: "WRONG_PASSWORD", message: "Password is incorrect" });
        return;
      }
    });
  });
};

const getAccessTokenWithRefreshToken = async (refreshToken) => {
  console.log(refreshToken);
  const SPOTIFY_REFRESH_TOKEN_URL = "https://accounts.spotify.com/api/token";
  return axios.post(
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
      },
    }
  );
};

export const logOut = (req, res) => {
  res.clearCookie("access_token");
  res.clearCookie("spotify_refresh_token");
  res.clearCookie("spotify_token_expiration_date");
  res.clearCookie("spotify_access_token");
  res.status(200).json({ message: "Successfully logged out" });
};
