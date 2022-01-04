import { useState } from "react"
import { t } from "@bloom-housing/ui-components"

export type NetworkErrorValue = {
  title: string
  content: string
} | null

export type NetworkErrorDetermineError = (status: number, error: Error) => void

export type NetworkErrorReset = () => void

/**
 * This helper can be used in the catch part for each network request. It determines a proper title and message for AlertBox + AlertNotice components depending on error status code.
 */
export const useCatchNetworkError = () => {
  const [networkError, setNetworkError] = useState<NetworkErrorValue>(null)

  const determineNetworkError: NetworkErrorDetermineError = (status, error) => {
    if (status === 401) {
      setNetworkError({
        title: t("authentication.signIn.enterValidEmailAndPassword"),
        content: t("authentication.signIn.afterFailedAttempts"),
      })
    } else if (status === 429) {
      setNetworkError({
        title: t("authentication.signIn.accountHasBeenLocked"),
        content: t("authentication.signIn.youHaveToWait"),
      })
    } else {
      console.error(error)

      setNetworkError({
        title: t("authentication.signIn.error"),
        content: t("authentication.signIn.errorGenericMessage"),
      })
    }
  }

  const resetNetworkError: NetworkErrorReset = () => setNetworkError(null)

  return {
    networkError,
    determineNetworkError,
    resetNetworkError,
  }
}
