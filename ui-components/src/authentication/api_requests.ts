import axios, { AxiosInstance } from "axios"
import { getTokenTtl } from "./token"
import { UserCreate, User, Status } from "@bloom-housing/backend-core/types"

export const renewToken = async (client: AxiosInstance) => {
  const res = await client.post<{ accessToken: string }>("auth/token")
  const { accessToken } = res.data
  return accessToken
}

export const login = async (apiBase: string, email: string, password: string) => {
  const res = await axios.post<{ accessToken: string }>(`${apiBase}/auth/login`, {
    email: email,
    password,
  })
  const { accessToken } = res.data
  return accessToken
}

export const register = async (apiBase: string, data: UserCreate) => {
  const res = await axios.post<{ accessToken: string } & Status>(`${apiBase}/user`, {
    appUrl: window.location.origin,
    ...data,
  })
  return { ...res.data }
}

export const resendConfirmation = async (apiBase: string, email: string) => {
  const res = await axios.post<{ accessToken: string } & Status>(
    `${apiBase}/user/resend-confirmation`,
    {
      appUrl: window.location.origin,
      email: email,
    }
  )
  return { ...res.data }
}

export const getProfile = async (client: AxiosInstance) => {
  const res = await client.get<User>("/user")
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
      void run()
    }, Math.max(ttl - 60000, 0)) as unknown) as number
  }
}

export const forgotPassword = async (apiUrl: string, email: string) => {
  const res = await axios.put<{ message: string }>(`${apiUrl}/user/forgot-password`, {
    appUrl: window.location.origin,
    email: email,
  })
  const { message } = res.data
  return message
}

export const resetPassword = async (
  apiUrl: string,
  token: string,
  password: string,
  passwordConfirmation: string
) => {
  const res = await axios.put<{ accessToken: string }>(`${apiUrl}/user/update-password`, {
    password: password,
    passwordConfirmation: passwordConfirmation,
    token: token,
  })
  const { accessToken } = res.data
  return accessToken
}

export const confirmAccount = async (apiUrl: string, token: string) => {
  const res = await axios.put<{ accessToken: string }>(`${apiUrl}/user/confirm`, {
    token: token,
  })
  const { accessToken } = res.data
  return accessToken
}
