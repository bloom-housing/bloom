import React, { FunctionComponent, useContext, useEffect } from "react"
import { useRouter } from "next/router"
import { UserContext } from "./UserContext"

// See https://github.com/Microsoft/TypeScript/issues/14094
type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }
type XOR<T, U> = T | U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U

type RequireLoginProps = {
  signInPath: string
} & XOR<{ requireForRoutes?: string[] }, { skipForRoutes: string[] }>

/**
 * Require a login to render children. Will redirect to `signInPath` if not logged in.
 *
 * Props can be specified with either a "whitelist" (list of routes to skip check for) or a "blacklist" (list of
 * routes to apply test on). If no list of routes is provided, then will always apply check.
 */
const RequireLogin: FunctionComponent<RequireLoginProps> = ({ children, signInPath, ...rest }) => {
  const router = useRouter()
  const { profile, initialStateLoaded } = useContext(UserContext)

  // Parse just the pathname portion of the signInPath (in case we want to pass URL params)
  const [signInPathname] = signInPath.split("?")

  // Check if this route requires a login or not (can be specified as a whitelist or a blacklist).
  const loginRequiredForPath =
    // by definition, we shouldn't require login on the sign in page itself
    router.pathname !== signInPathname &&
    ("requireForRoutes" in rest
      ? rest.requireForRoutes
        ? rest.requireForRoutes.some((path) => new RegExp(path).exec(router.pathname))
        : true
      : rest.skipForRoutes
      ? !rest.skipForRoutes.some((path) => new RegExp(path).exec(router.pathname))
      : true)

  useEffect(() => {
    if (loginRequiredForPath && initialStateLoaded && !profile) {
      router.push(signInPath)
    }
  }, [loginRequiredForPath, initialStateLoaded, profile, router, signInPath])

  if (loginRequiredForPath && !profile) {
    return null
  }

  // Login either isn't required, or the user object is loaded successfully, continue rendering as normal.
  return <>{children}</>
}

export { RequireLogin as default, RequireLogin }
