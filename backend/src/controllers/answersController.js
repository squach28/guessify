import { db } from "../utils/db.js";
import { queries } from "../utils/queries.js";

export const getAnswers = (req, res) => {
  const { id } = req.params;
  const { shuffled } = req.query;
  if (id === undefined) {
    res.status(400).json({ message: "Missing id in params" });
    return;
  }
  db.query(queries.getAnswersByGameId, [id], (err, result) => {
    if (err) throw err;
    const rows = result.rows;
    if (shuffled) {
      shuffleRanks(rows);
    }

    res.status(200).json(rows);
  });
};

const shuffleRanks = (array) => {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i].rank;
    array[i].rank = array[j].rank;
    array[j].rank = temp;
  }
};
