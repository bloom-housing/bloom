import { CookieOptions } from "express"
// Length of hashed key, in bytes
export const SCRYPT_KEYLEN = 64
export const SALT_SIZE = SCRYPT_KEYLEN
export const TOKEN_COOKIE_NAME = "access-token"
export const TOKEN_COOKIE_MAXAGE = 86400000
export const AUTH_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: true,
  maxAge: TOKEN_COOKIE_MAXAGE,
}
