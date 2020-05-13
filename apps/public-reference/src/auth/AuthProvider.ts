import {
  createContext,
  createElement,
  useState,
  FunctionComponent,
  useCallback,
  useEffect
} from "react"
import { UserManager } from "oidc-client"

// Create a singleton UserManager that will manage our connection to the DB
// TODO: make this configurable
/* eslint-disable @typescript-eslint/camelcase */
const managerConfig = {
  authority: "http://localhost:3002",
  client_id: "bloom-housing-internal",
  redirect_uri: "http://localhost:3000/auth/callback",
  response_type: "code",
  scope: "openid"
}
/* eslint-enable @typescript-eslint/camelcase */

interface TokenState {
  accessToken: string
  expiresAt: Date
  scope: string
  idToken?: string
}

export interface RequestState {
  redirectPath: string
  [key: string]: any
}

export interface AuthContextValues {
  accessToken?: string
  login: (redirectPath?: string, otherState?: { [key: string]: any }) => void
  getTokens: () => Promise<RequestState>
}

const initialState = {} as AuthContextValues
export const AuthContext = createContext<AuthContextValues>(initialState)

const tokenStateFromUser = (user): TokenState => ({
  accessToken: user.access_token,
  expiresAt: new Date(user.expires_at),
  idToken: user.id_token,
  scope: user.scope
})

// We need a static guard to make sure the UserManager doesn't get created by the Next.js build, which doesn't have
// localStorage.
const IS_STATIC = typeof window === "undefined"

export const AuthProvider = <FunctionComponent>({ children }) => {
  const [manager] = useState<UserManager>(IS_STATIC ? undefined : new UserManager(managerConfig))
  const [tokenState, setTokenState] = useState<TokenState>()

  const value = {
    ...(tokenState && { accessToken: tokenState.accessToken }),
    login: useCallback((redirectPath = "/", otherState: { [key: string]: any }) => {
      return manager.signinRedirect({ state: { ...otherState, redirectPath } })
    }, []),
    getTokens: useCallback(async () => {
      const user = await manager.signinCallback()
      const { state } = user

      setTokenState(tokenStateFromUser(user))
      return state
    }, [setTokenState])
  }

  return createElement(AuthContext.Provider, { value }, children)
}

export default AuthProvider
