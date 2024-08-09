export const queries = {
  signup:
    "INSERT INTO auth (email, username, password) VALUES  ($1, $2, $3) RETURNING id",
  getUserByUsername: "SELECT * FROM auth WHERE username = $1",
  getUserById: "SELECT * FROM auth WHERE id = $1",
  getUserByEmail: "SELECT * FROM auth WHERE email = $1",
};
