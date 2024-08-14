export const queries = {
  signup:
    "INSERT INTO auth (email, username, password) VALUES  ($1, $2, $3) RETURNING id",
  getUserByUsername: "SELECT * FROM users WHERE username = $1",
  getUserByUsernameAuth: "SELECT * FROM auth WHERE username = $1",
  getUserById: "SELECT * FROM users WHERE id = $1",
  getUserByEmail: "SELECT * FROM users WHERE email = $1",
  createUser: "INSERT INTO users (id, username, email) VALUES ($1, $2, $3)",
  updateSpotifyIDByUserId: "UPDATE users SET spotify_id = $1 WHERE id = $2",
  updateSpotifyStateByUserId:
    "UPDATE auth SET spotify_state = $1 WHERE id = $2",
  getUserIdBySpotifyState: "SELECT id FROM auth WHERE spotify_state = $1",
  createGame: `WITH new_game AS (INSERT INTO games (user_id, date) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING id) 
  SELECT COALESCE((SELECT id FROM new_game), (SELECT id FROM games WHERE user_id = $1 AND date = $2)) AS id`,
  insertAnswer:
    "INSERT INTO answers (id, game_id, name, artists, rank) VALUES ($1, $2, $3, $4, $5)",
  getGamesForCurerntUser: "SELECT * FROM games WHERE user_id = $1",
};
