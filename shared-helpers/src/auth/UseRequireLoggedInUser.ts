import { useContext } from "react"
import { AuthContext } from "./AuthContext"
import { NavigationContext } from "@bloom-housing/ui-components"

/**
 * Require a logged in user. Waits on initial load, then initiates a redirect to `redirectPath` if user is not
 * logged in.
 */
function useRequireLoggedInUser(redirectPath: string, disable?: boolean) {
  const { profile, initialStateLoaded } = useContext(AuthContext)
  const { router } = useContext(NavigationContext)

  if (!disable && initialStateLoaded && !profile) {
    void router.push(redirectPath)
  }
  return profile
}

export { useRequireLoggedInUser as default, useRequireLoggedInUser }
