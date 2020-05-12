import React, { useContext, useEffect, useState } from "react"
import { AuthContext, RequestState } from "./AuthProvider"

const parseUrlParams = () => {
  // Make sure that window.location exists (necessary for some static builds)
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search)
    const error = params.get("error")
    const errorDescription = params.get("error_description")

    return {
      error: error && [error, errorDescription].join(": "),
      code: params.get("code"),
      stateKey: params.get("state")
    }
  }
  return {}
}

export interface RedirectProps {
  onLogin: (RequestState) => void
}

const Redirect = ({ onLogin }: RedirectProps) => {
  const { getTokens } = useContext(AuthContext)
  const { error: urlError, code, stateKey } = parseUrlParams()
  const [errorState, setErrorState] = useState<string>()

  // If code is available as a URL param, get the actual tokens from the server.
  useEffect(() => {
    if (code) {
      // exchange authorization code for tokens
      const handleAuthCode = async () => {
        try {
          const { state, error } = await getTokens(code, stateKey)
          if (error) {
            setErrorState(error)
          } else {
            onLogin(state)
          }
        } catch (err) {
          setErrorState(err.message)
        }
      }
      handleAuthCode()
    }
  }, [code, stateKey])

  // TODO: add translations

  const error = errorState || urlError
  return (
    <div className="flex flex-col items-center py-10">
      {error ? (
        <>
          <h3 className="m-auto text-danger">There was an error logging you in:</h3>
          <div className="flex rounded-lg bg-red-300 border shadow w-full max-w-lg p-3">
            <p className="m-auto">{error}</p>
          </div>
        </>
      ) : (
        <h3 className="m-auto text-gray-800">Loading...</h3>
      )}
    </div>
  )
}

export { Redirect as default, Redirect }
