import { createContext, createElement, useReducer, FunctionComponent } from "react"
import axios, { AxiosInstance } from "axios"
import { createAction, createReducer } from "typesafe-actions"

type UserState = {
  loading: boolean
  accessToken?: string
  profile?: User
  client?: AxiosInstance
}

// TODO: load actual DTO from backend/core
type CreateUserDto = {
  [key: string]: any
}

// TODO: load actual User from backend/core
type User = {
  [key: string]: any
}

const renewToken = async (client: AxiosInstance) => {
  const res = await client.post<{ accessToken: string }>("auth/token")
  const { accessToken } = res.data
  return accessToken
}

const login = async (apiBase: string, email: string, password: string) => {
  const res = await axios.post<{ accessToken: string }>(`${apiBase}/auth/login`, {
    username: email,
    password,
  })
  const { accessToken } = res.data
  return accessToken
}

const register = async (apiBase: string, data: CreateUserDto) => {
  const res = await axios.post<{ accessToken: string } & User>(`${apiBase}/auth/register`, data)
  const { accessToken, ...rest } = res.data
  const user = rest as User
  return { accessToken, user }
}

const getProfile = async (client: AxiosInstance) => {
  const res = await client.get<User>("/user/profile")
  return res.data
}

const createAxiosInstance = (apiUrl: string, accessToken: string) =>
  axios.create({
    baseURL: apiUrl,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

const saveToken = createAction("SAVE_TOKEN")<{ apiUrl: string; accessToken: string }>()
const startLoading = createAction("START_LOADING")()
const stopLoading = createAction("STOP_LOADING")()
const saveProfile = createAction("SAVE_PROFILE")<User>()

const reducer = createReducer({ loading: false } as UserState, {
  SAVE_TOKEN: (state, { payload }) => ({
    ...state,
    client: createAxiosInstance(payload.apiUrl, payload.accessToken),
    accessToken: payload.accessToken,
  }),
  START_LOADING: (state) => ({ ...state, loading: true }),
  END_LOADING: (state) => ({ ...state, loading: false }),
  SAVE_PROFILE: (state, { payload: user }) => ({ ...state, profile: user }),
})

type ContextProps = {
  login: (email: string, password: string) => Promise<User>
  register: (user: CreateUserDto) => Promise<User>
  loading: boolean
  profile?: User
  axiosClient?: AxiosInstance
}

export const UserContext = createContext<Partial<ContextProps>>({})

export const UserProvider: FunctionComponent<{ apiUrl: string }> = ({ apiUrl, children }) => {
  const [state, dispatch] = useReducer(reducer, { loading: false })

  const refreshToken = async () => {
    // We can only refresh our token if we have an existing token
    if (state.accessToken && state.client) {
      const accessToken = await renewToken(state.client)
      dispatch(saveToken({ accessToken, apiUrl }))
    }
  }

  const contextValues: ContextProps = {
    loading: state.loading,
    profile: state.profile,
    axiosClient: state.client,
    login: async (email, password) => {
      dispatch(startLoading())
      try {
        const accessToken = await login(apiUrl, email, password)
        dispatch(saveToken({ accessToken, apiUrl }))
        const profile = await getProfile(createAxiosInstance(apiUrl, accessToken))
        dispatch(saveProfile(profile))
        return profile
      } finally {
        dispatch(stopLoading())
      }
    },
    register: async (user: CreateUserDto) => {
      dispatch(startLoading())
      try {
        const { accessToken, user: profile } = await register(apiUrl, user)
        dispatch(saveToken({ accessToken, apiUrl }))
        dispatch(saveProfile(profile))
        return profile
      } finally {
        dispatch(stopLoading())
      }
    },
  }
  return createElement(UserContext.Provider, { value: contextValues }, children)
}
