import React, { FunctionComponent, useContext, useEffect, useState } from "react"
import { NavigationContext } from "@bloom-housing/ui-components"
import { AuthContext } from "./AuthContext"
import { useToastyRef } from "../utilities/MessageContext"

// See https://github.com/Microsoft/TypeScript/issues/14094
type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }
type XOR<T, U> = T | U extends Record<string, unknown>
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U

type RequireLoginProps = {
  signInPath: string
  signInMessage: string
  termsPath?: string // partners portal required accepted terms after sign-in
  children?: React.ReactNode
} & XOR<{ requireForRoutes?: string[] }, { skipForRoutes: string[] }>

/**
 * Require a login to render children. Will redirect to `signInPath` if not logged in.
 *
 * Props can be specified with either an "allowlist" (list of routes to skip check for) or a "blocklist" (list of
 * routes to apply test on). If no list of routes is provided, then will always apply check.
 */
const RequireLogin: FunctionComponent<RequireLoginProps> = ({
  children,
  signInPath,
  signInMessage,
  termsPath,
  ...rest
}) => {
  const { router } = useContext(NavigationContext)
  const { profile, initialStateLoaded } = useContext(AuthContext)
  const toastyRef = useToastyRef()
  const [hasTerms, setHasTerms] = useState(false)

  // Parse just the pathname portion of the signInPath (in case we want to pass URL params)
  const [signInPathname] = signInPath.split("?")

  // Check if this route requires a login or not (can be specified as an allowlist or a blocklist).
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
    if (profile?.jurisdictions?.some((jurisdiction) => jurisdiction.partnerTerms)) {
      setHasTerms(true)
    }
  }, [profile])

  useEffect(() => {
    const { addToast } = toastyRef.current

    if (loginRequiredForPath && initialStateLoaded && !profile) {
      addToast(signInMessage, { variant: "primary" })
      void router.push(signInPath)
    }

    if (termsPath && profile && !profile?.agreedToTermsOfService && hasTerms) {
      void router.push(termsPath)
    }
  }, [
    loginRequiredForPath,
    initialStateLoaded,
    profile,
    router,
    signInPath,
    signInMessage,
    termsPath,
    hasTerms,
    toastyRef,
  ])

  if (
    loginRequiredForPath &&
    (!profile || (hasTerms && termsPath && !profile.agreedToTermsOfService))
  ) {
    return null
  }

  // Login either isn't required, or the user object is loaded successfully, continue rendering as normal.
  return <>{children}</>
}

export { RequireLogin as default, RequireLogin }
