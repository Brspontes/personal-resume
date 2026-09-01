import axios from "axios";

export const reactionsApiBaseUrl = process.env.NEXT_PUBLIC_REACTIONS_API_URL;

// `withCredentials` makes the browser attach the backend's own-origin,
// httpOnly session cookie automatically; this client never reads or stores
// the cookie or a JWT itself.
export const http = axios.create({
  baseURL: reactionsApiBaseUrl,
  withCredentials: true,
});
