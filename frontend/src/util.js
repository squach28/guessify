export const findCookieByKey = (key) => {
  const splitValues = document.cookie.split("; ");
  const keyValuePair = splitValues.find((row) => row.startsWith(key));
  if (keyValuePair === undefined) {
    return null;
  }
  const value = keyValuePair.split("=")[1];
  return value;
};
