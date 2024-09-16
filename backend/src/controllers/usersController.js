import { queries } from "../utils/queries.js";
import { db } from "../utils/db.js";
import fs from "node:fs";
import { storage } from "../utils/firebase.js";
import { getDownloadURL } from "firebase-admin/storage";

export const getUser = (req, res) => {
  const { username, email } = req.query;
  if (username) {
    db.query(queries.getUserByUsername, [username], (err, result) => {
      if (err) throw err;
      if (result.rowCount === 0) {
        res.status(400).json({ message: `User doesn't exist` });
      } else {
        res.status(200).json({ message: "User found" });
      }
    });
  } else if (email) {
    db.query(queries.getUserByEmail, [email], (err, result) => {
      if (err) throw err;
      if (result.rowCount === 0) {
        res.status(400).json({ message: `User doesn't exist` });
      } else {
        res.status(200).json({ message: "User found" });
      }
    });
  } else {
    res.status(400).json({ message: "Missing username or email query" });
  }
};

export const getCurrentUser = (req, res) => {
  const userId = req.userId;
  db.query(queries.getUserById, [userId], (err, result) => {
    if (err) throw err;
    if (result.rowCount === 0) {
      res.status(404).json({ message: "User not found" });
    } else {
      const {
        id,
        username,
        email,
        image_url: imageUrl,
        spotify_id: spotifyId,
      } = result.rows[0];
      res.status(200).json({ id, username, email, imageUrl, spotifyId });
    }
  });
};

export const updateProfilePicture = (req, res) => {
  const file = req.file;
  const userId = req.userId;
  const fileName = file.originalname;
  const split = fileName.split(".");
  const fileType = split[split.length - 1];
  const filePath = file.path;

  fs.readFile(filePath, (err, data) => {
    if (err) throw err;
    const destination = `${userId}/avatar.${fileType}`;
    const options = {
      destination,
    };
    storage.upload(file.path, options, (err, file) => {
      if (err) throw err;
      const avatar = storage.file(destination);
      getDownloadURL(avatar).then((imageUrl) => {
        db.query(
          queries.updateImageUrlByUserId,
          [imageUrl, userId],
          (err, result) => {
            if (err) throw err;
            console.log(result);
          }
        );
      });
      fs.rm(filePath, (err) => {
        if (err) throw err;
      });
    });
  });
  res.status(201).json({ message: "success" });
};

export const getUserById = (req, res) => {};
