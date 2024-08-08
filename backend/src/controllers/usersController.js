import { getUserByEmail, getUserByUsername } from "../utils/queries.js";
import { db } from "../utils/db.js";
export const getUser = (req, res) => {
  const { username, email } = req.query;
  if (username) {
    db.query(getUserByUsername, [username], (err, result) => {
      if (err) throw err;
      if (result.rowCount === 0) {
        res.status(400).json({ message: `User doesn't exist` });
      } else {
        res.status(200).json({ message: "User found" });
      }
    });
  } else if (email) {
    db.query(getUserByEmail, [email], (err, result) => {
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

export const getUserById = (req, res) => {};
