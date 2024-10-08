import axios from "axios";
import { commitTransaction, db } from "../utils/db.js";
import { queries } from "../utils/queries.js";

const SPOTIFY_TOP_SONGS_URL =
  "https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=short_term";

export const createGame = (req, res) => {
  const userId = req.userId;
  const { date } = req.body;
  let accessToken = "";
  if (req.newAccessToken) {
    accessToken = req.newAccessToken;
  } else {
    const { spotify_access_token: spotifyAccessToken } = req.cookies;
    accessToken = spotifyAccessToken;
  }

  const previousMonth = new Date(date);
  previousMonth.setDate(1);
  previousMonth.setMonth(previousMonth.getMonth() - 1);

  db.query(
    queries.getGameForCurrentUserByDate,
    [userId, previousMonth],
    (err, result) => {
      if (err) throw err;
      if (result.rowCount > 0) {
        res.status(200).json({ message: "Game already exists" });
        return;
      } else {
        axios
          .get(SPOTIFY_TOP_SONGS_URL, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then((result) => {
            const answers = result.data.items.map((item, index) => {
              return {
                id: item.id,
                name: item.name,
                artists: item.artists,
                rank: index + 1,
              };
            });

            commitTransaction(db, queries.createGame, [
              userId,
              previousMonth,
            ]).then((dbResult) => {
              const { id } = dbResult.rows[0];
              uploadAnswers(db, id, answers);
            });
            res.status(201).json(result.data);
            return;
          });
      }
    }
  );
};

export const getGamesForCurrentUser = (req, res) => {
  const userId = req.userId;
  if (userId === undefined) {
    res.status(400).json({ message: "Missing userId parameter" });
  } else {
    db.query(queries.getGamesForCurrentUser, [userId], (err, result) => {
      if (err) throw err;
      res.status(200).json(result.rows);
    });
  }
};

const artistsToString = (artists) => {
  const names = artists.map((artist) => artist.name);
  return names.join(", ");
};

const uploadAnswers = async (db, gameId, answers) => {
  const promises = answers.map((answer) => {
    return commitTransaction(db, queries.insertAnswer, [
      answer.id,
      gameId,
      answer.name,
      artistsToString(answer.artists),
      answer.rank,
    ]);
  });
  return Promise.all(promises);
};
