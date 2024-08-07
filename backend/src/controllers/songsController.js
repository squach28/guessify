import axios from "axios";

const SPOTIFY_TOP_SONGS_URL =
  "https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=short_term";

const shuffleArray = (array) => {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
};

export const getTopSongs = (req, res) => {
  let accessToken = "";
  let expirationDate = "";
  const { shuffled } = req.query;
  if (req.newAccessToken) {
    accessToken = req.newAccessToken;
    expirationDate = req.newExpirationDate;
  } else {
    accessToken = req.cookies["access_token"];
    expirationDate = req.cookies["token_expiration_date"];
  }
  if (accessToken === undefined) {
    res.status(403).send("Missing access token");
  } else {
    axios
      .get(SPOTIFY_TOP_SONGS_URL, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((result) => {
        res.cookie("access_token", accessToken);
        res.cookie("token_expiration_date", expirationDate);
        const songs = result.data.items.map((item) => {
          return {
            id: item.id,
            name: item.name,
            artists: item.artists,
          };
        });
        if (shuffled) {
          shuffleArray(songs);
        }
        res.status(200).json(songs);
      })
      .catch((e) => console.log(e));
  }
};
