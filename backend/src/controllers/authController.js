import querystring from "node:querystring";
import { generateRandomString } from "../utils/util.js";

export const authLogin = (req, res) => {
  const state = generateRandomString(16);
  const scope = "user-top-read";
  const redirectUri = "http://localhost:3000/callback";
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: "client_id",
        scope,
        redirect_uri: redirectUri,
        state,
      })
  );
};
