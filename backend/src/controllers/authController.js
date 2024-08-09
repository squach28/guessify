import querystring from "node:querystring";
import axios from "axios";
import { generateRandomString } from "../utils/util.js";
import dotenv from "dotenv";
import { db } from "../utils/db.js";
import { queries } from "../utils/queries.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

const SALT_ROUNDS = 10;

export const spotifyLogin = (req, res) => {
  const state = generateRandomString(16);
  const scope = "user-top-read user-read-email";
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

const createUser = async (id, username, email) => {
  return db.query(queries.createUser, [id, username, email], (err, result) => {
    if (err) throw err;
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
  bcrypt.genSalt(SALT_ROUNDS, (err, salt) => {
    if (err) throw err;
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) throw err;
      db.query(queries.signup, [email, username, hash], (err, result) => {
        if (err) throw err;
        const { id } = result.rows[0];
        createUser(id, username, email);
        const accessToken = jwt.sign({ id, username }, process.env.JWT_SECRET, {
          expiresIn: "1 day",
        });
        res.cookie("user_id", id, {
          httpOnly: true,
        });
        res.cookie("access_token", accessToken, {
          httpOnly: true,
        });
        res.status(201).json({ id });
        return;
      });
    });
  });
};

export const logIn = (req, res) => {
  const { username, password } = req.body;
  if (username === undefined || password === undefined) {
    res.status(400).json({
      message: "Request body is missing username or password.",
    });
  }
  db.query(queries.getUserByUsername, [username], (err, result) => {
    if (err) throw err;
    if (result.rowCount === 0) {
      res
        .status(404)
        .json({ message: `User with username ${username} doesn't exist` });
      return;
    }
    const { id, username, password: hashedPassword } = result.rows[0];
    bcrypt.compare(password, hashedPassword).then((match) => {
      if (match) {
        const accessToken = jwt.sign({ id, username }, process.env.JWT_SECRET, {
          expiresIn: "1 day",
        });
        res.cookie("access_token", accessToken, {
          httpOnly: true,
        });
        res.status(200).json({ message: "Sucess" });
      } else {
        res.status(400).json({ message: "Password is incorrect" });
      }
    });
  });
};

export const logOut = (req, res) => {
  res.clearCookie("access_token");
  res.status(200).json({ message: "Successfully logged out" });
};
