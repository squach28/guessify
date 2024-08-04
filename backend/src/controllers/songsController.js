import axios from "axios";

const SPOTIFY_TOP_SONGS_URL = "https://api.spotify.com/v1/me/top/tracks";

export const getTopSongs = (req, res) => {
  const { access_token: accessToken } = req.cookies;
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
        res.status(200).json(result.data.items);
      });
  }
};
