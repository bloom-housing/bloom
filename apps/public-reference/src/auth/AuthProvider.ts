import { createContext, createElement, useState, useCallback, useEffect } from "react"
import { UserManager, Log } from "oidc-client"

// Create a singleton UserManager that will manage our connection to the DB
// TODO: make this configurable
/* eslint-disable @typescript-eslint/camelcase */
const managerConfig = {
  authority: "http://localhost:3002",
  client_id: "bloom-housing-internal",
  redirect_uri: "http://localhost:3000/auth/callback",
  silent_redirect_uri: "http://localhost:3000/auth/iframe_callback.html",
  response_type: "code",
  scope: "openid"
}
/* eslint-enable @typescript-eslint/camelcase */
Log.logger = console

interface TokenState {
  accessToken: string
  expiresAt: Date
  scope: string
  idToken?: string
}

export interface RequestState {
  redirectPath: string
  [key: string]: unknown
}

export interface AuthContextValues {
  accessToken?: string
  login: (redirectPath?: string, otherState?: { [key: string]: unknown }) => void
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

  // Try silently loading token state based on the session if available
  useEffect(() => {
    if (!tokenState) {
      const tryLoadSession = async () => {
        try {
          const user = await manager.signinSilent()
          if (user) {
            setTokenState(tokenStateFromUser(user))
          }
        } catch (err) {
          console.debug(`Silent sign-in failed: ${err}`)
        }
      }
      tryLoadSession()
    }
    return () => {
      console.log(`destructing provider in ${window.location.pathname}`)
    }
  }, [tokenState, manager])

  const value = {
    ...(tokenState && { accessToken: tokenState.accessToken }),
    login: useCallback(
      (redirectPath = "/", otherState: { [key: string]: unknown }) => {
        return manager.signinRedirect({ state: { ...otherState, redirectPath } })
      },
      [manager]
    ),
    getTokens: useCallback(async () => {
      const user = await manager.signinCallback()
      const { state } = user

      setTokenState(tokenStateFromUser(user))
      return state
    }, [setTokenState, manager])
  }

  return createElement(AuthContext.Provider, { value }, children)
}

export default AuthProvider
