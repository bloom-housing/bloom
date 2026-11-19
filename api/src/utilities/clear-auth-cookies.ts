import { Response } from 'express';
import {
  ACCESS_TOKEN_AVAILABLE_NAME,
  ACCESS_TOKEN_AVAILABLE_OPTIONS,
  AUTH_COOKIE_OPTIONS,
  REFRESH_COOKIE_NAME,
  REFRESH_COOKIE_OPTIONS,
  TOKEN_COOKIE_NAME,
} from '../services/auth.service';

/*
  clears the browser's auth cookies after the server has rejected the
  credentials they carried (e.g. a token invalidated by a login elsewhere),
  so the browser stops resending a dead session on every subsequent request
*/
export function clearStaleAuthCookies(res: Response): void {
  res.clearCookie(TOKEN_COOKIE_NAME, AUTH_COOKIE_OPTIONS);
  res.clearCookie(REFRESH_COOKIE_NAME, REFRESH_COOKIE_OPTIONS);
  res.clearCookie(ACCESS_TOKEN_AVAILABLE_NAME, ACCESS_TOKEN_AVAILABLE_OPTIONS);
}
