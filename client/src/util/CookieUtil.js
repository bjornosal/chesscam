export const setCookieToNeverExpire = (cookieName) => {
  document.cookie = `${cookieName}=true; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
};

export const cookieExists = (cookieName) => {
  return document.cookie.split("; ").find((row) => row.startsWith(cookieName));
};
