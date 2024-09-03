import { queries } from "../utils/queries.js";
import { db } from "../utils/db.js";
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
  const body = req.body;
  console.log(req.file);
  res.status(201).json({ message: "success" });
};

export const getUserById = (req, res) => {};
