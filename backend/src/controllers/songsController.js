import axios from "axios";

const SPOTIFY_TOP_SONGS_URL = "https://api.spotify.com/v1/me/top/tracks";

export const getTopSongs = (req, res) => {
  let accessToken = "";
  let expirationDate = "";
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
        res.status(200).json(result.data.items);
      })
      .catch((e) => console.log("error"));
  }
};
