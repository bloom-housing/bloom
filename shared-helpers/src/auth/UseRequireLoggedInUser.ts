import { useContext } from "react"
import { AuthContext } from "./AuthContext"
import { useRouter } from "next/router"

/**
 * Require a logged in user. Waits on initial load, then initiates a redirect to `redirectPath` if user is not
 * logged in.
 */
function useRequireLoggedInUser(redirectPath: string) {
  const { profile, initialStateLoaded } = useContext(AuthContext)
  const router = useRouter()

  if (process.env.showMandatedAccounts && initialStateLoaded && !profile) {
    void router.push(redirectPath)
  }
  return profile
}

export { useRequireLoggedInUser as default, useRequireLoggedInUser }
