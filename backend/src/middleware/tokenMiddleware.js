export const tokenMiddleware = (req, res) => {
  const { expiration_date: expirationDate, refresh_token: refreshToken } =
    req.cookie;
  const today = new Date();
  console.log(expirationDate);
};
