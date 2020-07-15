import axios, { AxiosInstance } from "axios"
import { CreateUserDto, User } from "@bloom-housing/backend-core/"
import { getTokenTtl } from "./token"

export const renewToken = async (client: AxiosInstance) => {
  const res = await client.post<{ accessToken: string }>("auth/token")
  const { accessToken } = res.data
  return accessToken
}

export const login = async (apiBase: string, email: string, password: string) => {
  const res = await axios.post<{ accessToken: string }>(`${apiBase}/auth/login`, {
    username: email,
    password,
  })
  const { accessToken } = res.data
  return accessToken
}

export const register = async (apiBase: string, data: CreateUserDto) => {
  const res = await axios.post<{ accessToken: string } & User>(`${apiBase}/auth/register`, data)
  const { accessToken, ...rest } = res.data
  const user = rest as User
  return { accessToken, user }
}

export const getProfile = async (client: AxiosInstance) => {
  const res = await client.get<User>("/user/profile")
  return res.data
}

export const createAxiosInstance = (apiUrl: string, accessToken: string) =>
  axios.create({
    baseURL: apiUrl,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

export const scheduleTokenRefresh = (
  apiUrl: string,
  accessToken: string,
  onRefresh: (accessToken: string) => void
) => {
  const ttl = getTokenTtl(accessToken)

  if (ttl < 0) {
    // If ttl is negative, then our token is already expired, we'll have to re-login to get a new token.
    //dispatch(signOut())
    return null
  } else {
    // Queue up a refresh for ~1 minute before the token expires
    return (setTimeout(() => {
      const run = async () => {
        const client = createAxiosInstance(apiUrl, accessToken)
        const newToken = await renewToken(client)
        if (newToken) {
          onRefresh(newToken)
        }
      }
      run()
    }, Math.max(ttl - 60000, 0)) as unknown) as number
  }
}
