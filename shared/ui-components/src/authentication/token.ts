import jwtDecode from "jwt-decode"

const ACCESS_TOKEN_LOCAL_STORAGE_KEY = "@bht"

const getStorage = (type: string) => (type === "local" ? localStorage : sessionStorage)

export const setToken = (storageType: string, token: string) =>
  getStorage(storageType).setItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY, token)
export const getToken = (storageType: string) =>
  getStorage(storageType).getItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY)
export const clearToken = (storageType: string) =>
  getStorage(storageType).removeItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY)

export const getTokenTtl = (token: string) => {
  const { exp = 0 } = jwtDecode(token)
  return new Date(exp * 1000).valueOf() - new Date().valueOf()
}
