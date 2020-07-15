import { useContext } from "react"
import { useRouter } from "next/router"
import { UserContext } from "./UserContext"

/**
 * Require a logged in user. Waits on initial load, then initiates a redirect to `redirectPath` if user is not
 * logged in.
 */
function useRequireLoggedInUser(redirectPath: string) {
  const { profile, initialStateLoaded } = useContext(UserContext)
  const router = useRouter()

  if (initialStateLoaded && !profile) {
    router.push(redirectPath)
  }
  return profile
}

export { useRequireLoggedInUser as default, useRequireLoggedInUser }
