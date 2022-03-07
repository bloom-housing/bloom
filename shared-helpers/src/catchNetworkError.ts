import { useState } from "react"
import { t } from "@bloom-housing/ui-components"
import axios, { AxiosError } from "axios"

export type NetworkErrorValue = {
  title: string
  content: string
  error: AxiosError
} | null

export type NetworkErrorDetermineError = (
  status: number,
  error: AxiosError,
  mfaEnabled?: boolean
) => void

export type NetworkErrorReset = () => void

export enum NetworkErrorMessage {
  PasswordOutdated = "passwordOutdated",
  MfaUnauthorized = "mfaUnauthorized",
}

/**
 * This helper can be used in the catch part for each network request. It determines a proper title and message for AlertBox + AlertNotice components depending on error status code.
 */
export const useCatchNetworkError = () => {
  const [networkError, setNetworkError] = useState<NetworkErrorValue>(null)

  const check401Error = (message: string, error: AxiosError) => {
    if (message === NetworkErrorMessage.PasswordOutdated) {
      setNetworkError({
        title: t("authentication.signIn.passwordOutdated"),
        content: `${t("authentication.signIn.changeYourPassword")} <a href="/forgot-password">${t(
          "t.here"
        )}</a>`,
        error,
      })
    } else if (message === NetworkErrorMessage.MfaUnauthorized) {
      setNetworkError({
        title: t("authentication.signIn.enterValidEmailAndPasswordAndMFA"),
        content: t("authentication.signIn.afterFailedAttempts"),
        error,
      })
    } else {
      setNetworkError({
        title: t("authentication.signIn.enterValidEmailAndPassword"),
        content: t("authentication.signIn.afterFailedAttempts"),
        error,
      })
    }
  }

  const determineNetworkError: NetworkErrorDetermineError = (status, error) => {
    const responseMessage = axios.isAxiosError(error) ? error.response?.data.message : ""

    switch (status) {
      case 401:
        check401Error(responseMessage, error)
        break
      case 429:
        setNetworkError({
          title: t("authentication.signIn.accountHasBeenLocked"),
          content: t("authentication.signIn.youHaveToWait"),
          error,
        })
        break
      default:
        setNetworkError({
          title: t("errors.somethingWentWrong"),
          content: t("authentication.signIn.errorGenericMessage"),
          error,
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
