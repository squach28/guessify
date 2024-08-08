export const signup =
  "INSERT INTO auth (email, username, password) VALUES  ($1, $2, $3) RETURNING id";
