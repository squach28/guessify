export const signup =
  "INSERT INTO auth (email, username, password) VALUES  ($1, $2, $3) RETURNING id";
export const getUserByUsername = "SELECT * FROM auth WHERE username = $1";
