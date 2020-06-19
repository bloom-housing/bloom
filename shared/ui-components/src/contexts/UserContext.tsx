import { createContext, createElement, useReducer, FunctionComponent, useEffect } from "react"
import axios, { AxiosInstance } from "axios"
import { createAction, createReducer } from "typesafe-actions"
import jwtDecode from "jwt-decode"
import { User, CreateUserDto } from "@bloom-housing/backend-core"

declare module "jwt-decode"

type UserState = {
  loading: boolean
  storageType: string
  accessToken?: string
  profile?: User
  client?: AxiosInstance
  refreshTimer?: number
}

const ACCESS_TOKEN_LOCAL_STORAGE_KEY = "@bht"

const getStorage = (type: string) => (type === "local" ? localStorage : sessionStorage)

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

type DispatchType = (...arg: [unknown]) => void

const saveToken = createAction("SAVE_TOKEN")<{
  apiUrl: string
  accessToken: string
  dispatch: DispatchType
}>()
const startLoading = createAction("START_LOADING")()
const stopLoading = createAction("STOP_LOADING")()
const saveProfile = createAction("SAVE_PROFILE")<User>()
const signOut = createAction("SIGN_OUT")()

const scheduleRefresh = (
  client: AxiosInstance,
  accessToken: string,
  dispatch: (...arg: [unknown]) => void
) => {
  const { exp = 0 } = jwtDecode(accessToken) as { exp?: number }
  const ttl = new Date(exp * 1000).valueOf() - new Date().valueOf()

  if (ttl < 0) {
    // If ttl is negative, then our token is already expired, we'll have to re-login to get a new token.
    dispatch(signOut())
    return null
  } else {
    // Queue up a refresh for ~1 minute before the token expires
    return (setTimeout(() => {
      const run = async () => {
        const accessToken = await renewToken(client)
        const apiUrl = client.defaults.baseURL
        if (apiUrl && accessToken) {
          dispatch(saveToken({ apiUrl, accessToken, dispatch }))
        }
      }
      run()
    }, Math.max(ttl - 60000, 0)) as unknown) as number
  }
}

const reducer = createReducer({ loading: false, storageType: "session" } as UserState, {
  SAVE_TOKEN: (state, { payload }) => {
    const { refreshTimer: oldRefresh, ...rest } = state
    const { accessToken, apiUrl, dispatch } = payload
    // If an existing refresh timer has been defined, remove it as the access token has changed
    if (oldRefresh) {
      clearTimeout(oldRefresh)
    }

    // Save off the token in local storage for persistence across reloads.
    getStorage(state.storageType).setItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY, accessToken)

    const client = createAxiosInstance(apiUrl, accessToken)
    const refreshTimer = scheduleRefresh(client, accessToken, dispatch)

    return {
      ...rest,
      ...(refreshTimer && { refreshTimer }),
      client,
      accessToken: accessToken,
    }
  },
  START_LOADING: (state) => ({ ...state, loading: true }),
  END_LOADING: (state) => ({ ...state, loading: false }),
  SAVE_PROFILE: (state, { payload: user }) => ({ ...state, profile: user }),
  SIGN_OUT: ({ storageType }) => {
    getStorage(storageType).removeItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY)
    return { loading: false, storageType }
  },
})

type ContextProps = {
  login: (email: string, password: string) => Promise<void>
  register: (user: CreateUserDto) => Promise<User>
  loading: boolean
  profile?: User
  axiosClient?: AxiosInstance
}

export const UserContext = createContext<Partial<ContextProps>>({})

export const UserProvider: FunctionComponent<{ apiUrl: string; storageType?: string }> = ({
  apiUrl,
  storageType = "session",
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    storageType,
  })

  // Load our profile as soon as we have an authenticated client available
  useEffect(() => {
    if (!state.profile && state.client) {
      const loadProfile = async (client: AxiosInstance) => {
        dispatch(startLoading())
        try {
          const profile = await getProfile(client)
          dispatch(saveProfile(profile))
          return profile
        } finally {
          dispatch(stopLoading())
        }
      }
      loadProfile(state.client)
    }
  }, [state.profile, state.client])

  // On initial load/reload, check localStorage to see if we have a token available
  useEffect(() => {
    const accessToken = getStorage(state.storageType).getItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY)
    if (accessToken) {
      dispatch(saveToken({ accessToken, apiUrl, dispatch }))
    }
  }, [apiUrl])

  const contextValues: ContextProps = {
    loading: state.loading,
    profile: state.profile,
    axiosClient: state.client,
    login: async (email, password) => {
      dispatch(startLoading())
      try {
        const accessToken = await login(apiUrl, email, password)
        dispatch(saveToken({ accessToken, apiUrl, dispatch }))
      } finally {
        dispatch(stopLoading())
      }
    },
    register: async (user: CreateUserDto) => {
      dispatch(startLoading())
      try {
        const { accessToken, user: profile } = await register(apiUrl, user)
        dispatch(saveToken({ accessToken, apiUrl, dispatch }))
        dispatch(saveProfile(profile))
        return profile
      } finally {
        dispatch(stopLoading())
      }
    },
  }
  return createElement(UserContext.Provider, { value: contextValues }, children)
}
