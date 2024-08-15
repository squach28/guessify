import { db } from "../utils/db.js";
import { firestore } from "../utils/firebase.js";
import { queries } from "../utils/queries.js";

export const getSessionByGameId = (req, res) => {
  const { gameId } = req.params;
  const userId = req.userId;
  if (gameId === undefined) {
    res.status(400).json({ message: "Missing gameID param" });
    return;
  }
  db.query(
    queries.getSessionByGameIdAndUserId,
    [gameId, userId],
    (err, result) => {
      if (err) throw err;
      if (result.rowCount === 0) {
        res.status(404).json({ message: "No session for user" });
        return;
      }
      const sessionId = result.rows[0].id;
      res.status(200).json({ sessionId });
    }
  );
};

export const createSession = (req, res) => {
  const userId = req.userId;
  const { gameId } = req.body;
  if (userId === undefined) {
    res.status(400).json({ message: "Missing userId" });
    return;
  }
  db.query(queries.createSession, [gameId, userId], (err, result) => {
    if (err) throw err;
    const { id } = result.rows[0];
    const session = firestore.collection("sessions").doc(id);
    session
      .set({
        user_id: userId,
        game_id: gameId,
      })
      .then(() => {
        res.status(201).json({ id });
      });

    return;
  });
};
