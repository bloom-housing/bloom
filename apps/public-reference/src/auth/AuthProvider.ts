import {
  createContext,
  createElement,
  useState,
  useReducer,
  FunctionComponent,
  useCallback, useEffect
} from "react"
import sha256 from "crypto-js/sha256"
import Base64 from "crypto-js/enc-base64"

// TODO: make this configurable
const AUTH_PATH = "http://localhost:3002/auth"
const AUTH_TOKEN_PATH = "http://localhost:3002/token"
const AUTH_CLIENT_ID = "bloom-housing-internal"
const AUTH_REDIRECT_PATH = "http://localhost:3000/auth/callback"

/**
 * Generates a code verifier value and code challenge for a PCKE auth flow.
 * Inspired by https://auth0.com/docs/api-auth/tutorials/authorization-code-grant-pkce
 */
function base64UrlEncode(base64) {
  return base64
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "")
}

function generateRandomString(numBytes = 12) {
  const bytes = new Uint8Array(numBytes)
  crypto.getRandomValues(bytes)
  return base64UrlEncode(btoa(bytes.toString()))
}

function generateCodeAndChallenge() {
  const verifier = generateRandomString(12)
  const challenge = base64UrlEncode(sha256(verifier).toString(Base64))
  return [verifier, challenge]
}

interface TokenState {
  accessToken: string
  expiresAt: Date
  scope: string
  idToken?: string
  refreshToken?: string
}

export interface RequestState {
  redirectPath: string
  [key: string]: any
}

type GetTokensReturnType = {
  error?: string
  state?: RequestState
}

export interface AuthContextValues {
  accessToken?: string
  login: (redirectPath?: string, otherState?: { [key: string]: any }) => void
  getTokens: (code: string, state: string) => Promise<GetTokensReturnType>
}

// type AuthAction = { type: "STORE_TOKENS"; accessToken: string; refreshToken?: string }

// function generateCodeAction(state) {
//   const [codeVerifier, codeChallenge] = generateCodeAndChallenge()
//   // TODO: store verifier in localStorage?
//   return { ...state, codeVerifier, codeChallenge }
// }

// function storeTokens(state, action) {
//   return {
//     ...state,
//     accessToken: action.accessToken,
//     refreshToken: action.refreshToken
//   }
// }

// function authStateReducer(state: AuthState, action: AuthAction): AuthState {
//   switch (action.type) {
//     case "STORE_TOKENS":
//       return storeTokens(state, action)
//     default:
//       return state
//   }
// }

/**
 * Initiate the login flow by navigating to the auth server with an OpenID call.
 */
function login(redirectPath = "/", otherState: { [key: string]: any }) {
  const [codeVerifier, codeChallenge] = generateCodeAndChallenge()

  // Store off state & nonce for CSRF protection & post login redirect
  const nonce = generateRandomString(8)
  localStorage.setItem(
    nonce,
    JSON.stringify({
      ...otherState,
      redirectPath,
      // Store off the code verifier for the second part of the login flow
      codeVerifier
    })
  )

  const loginUrl = new URL(AUTH_PATH)
  const { searchParams } = loginUrl
  searchParams.set("scope", "openid")
  searchParams.set("response_type", "code")
  searchParams.set("code_challenge", codeChallenge)
  searchParams.set("code_challenge_method", "S256")
  searchParams.set("client_id", AUTH_CLIENT_ID)
  searchParams.set("redirect_uri", AUTH_REDIRECT_PATH)
  searchParams.set("state", nonce)

  // Navigate to the auth server for our login
  window.location.href = loginUrl.toString()
}

async function tokensRequest(
  code: string,
  stateKey: string
): Promise<{ token?: TokenState; error?: string; state: RequestState }> {
  const state = JSON.parse(localStorage.getItem(stateKey))
  localStorage.removeItem(stateKey)

  if (!state) {
    throw new Error("Could not get access token because state was not found.")
  }

  const { codeVerifier, ...remainingState } = state

  if (!codeVerifier) {
    throw new Error("Could not get access token because no code verifier was found.")
  }

  const body = new URLSearchParams()
  body.append("grant_type", "authorization_code")
  body.append("code", code)
  body.append("redirect_uri", AUTH_REDIRECT_PATH)
  body.append("client_id", AUTH_CLIENT_ID)
  body.append("code_verifier", codeVerifier)

  const res = await fetch(AUTH_TOKEN_PATH, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body
  }).then(res => res.json())

  return {
    state: remainingState,
    ...(res.error
      ? { error: `${res.error}: ${res.error_description}` }
      : {
          token: {
            accessToken: res.access_token,
            expiresAt: new Date(new Date().getTime() + res.expires_in * 1000),
            idToken: res.id_token,
            refreshToken: res.refresh_token,
            scope: res.scope
          }
        })
  }
}

const initialState = {} as AuthContextValues
export const AuthContext = createContext<AuthContextValues>(initialState)

export const AuthProvider = <FunctionComponent>({ children }) => {
  // const [state, dispatch] = useReducer(authStateReducer, initialState)
  const [tokenState, setTokenState] = useState<TokenState>()

  // Listener to try to grab an access token based on session if we don't have one already
  useEffect(() => {
    if (!tokenState.accessToken) {

    }
  }[tokenState])

  const value = {
    ...(tokenState && { accessToken: tokenState.accessToken }),
    login,
    getTokens: useCallback(
      async (code, stateKey) => {
        const { state, token, error } = await tokensRequest(code, stateKey)

        if (error) {
          return { state, error }
        }
        setTokenState(token)
        return { state }
      },
      [setTokenState]
    )
  }

  return createElement(AuthContext.Provider, { value }, children)
}

export default AuthProvider
