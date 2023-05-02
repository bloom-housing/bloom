import { CookieOptions } from "express"
// Length of hashed key, in bytes
export const SCRYPT_KEYLEN = 64
export const SALT_SIZE = SCRYPT_KEYLEN
export const TOKEN_COOKIE_NAME = "access-token"
export const REFRESH_COOKIE_NAME = "refresh-token"
export const ACCESS_TOKEN_AVAILABLE_NAME = "access-token-available"
export const TOKEN_COOKIE_MAXAGE = 86400000 // 24 hours
export const AUTH_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  // since our local env doesn't have an https cert we can't be secure. Hosted envs should be secure
  secure: process.env.NODE_ENV !== "development",
  sameSite: process.env.NODE_ENV === "development" ? "strict" : "none",
  maxAge: TOKEN_COOKIE_MAXAGE / 24, // access token should last 1 hr
}
export const REFRESH_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV !== "development",
  sameSite: process.env.NODE_ENV === "development" ? "strict" : "none",
  maxAge: TOKEN_COOKIE_MAXAGE,
}
export const ACCESS_TOKEN_AVAILABLE_OPTIONS: CookieOptions = {
  httpOnly: false,
  secure: process.env.NODE_ENV !== "development",
  sameSite: process.env.NODE_ENV === "development" ? "strict" : "none",
  maxAge: TOKEN_COOKIE_MAXAGE / 24, // flag should last 1 hr
}
