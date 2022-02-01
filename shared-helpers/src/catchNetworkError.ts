import { useState } from "react"
import { t } from "@bloom-housing/ui-components"
import axios, { AxiosError } from "axios"

export type NetworkErrorValue = {
  title: string
  content: string
} | null

export type NetworkErrorDetermineError = (
  status: number,
  error: Error | AxiosError,
  mfaEnabled?: boolean
) => void

export type NetworkErrorReset = () => void

export enum NetworkErrorMessage {
  PasswordOutdated = "passwordOutdated",
}

/**
 * This helper can be used in the catch part for each network request. It determines a proper title and message for AlertBox + AlertNotice components depending on error status code.
 */
export const useCatchNetworkError = () => {
  const [networkError, setNetworkError] = useState<NetworkErrorValue>(null)

  const check401Error = (message: string, mfaEnabled?: boolean) => {
    if (message === NetworkErrorMessage.PasswordOutdated) {
      setNetworkError({
        title: mfaEnabled
          ? t("authentication.signIn.enterValidEmailAndPasswordAndMFA")
          : t("authentication.signIn.passwordOutdated"),
        content: `${t("authentication.signIn.changeYourPassword")} <a href="/forgot-password">${t(
          "t.here"
        )}</a>`,
      })
    } else {
      setNetworkError({
        title: t("authentication.signIn.enterValidEmailAndPassword"),
        content: t("authentication.signIn.afterFailedAttempts"),
      })
    }
  }

  const determineNetworkError: NetworkErrorDetermineError = (status, error) => {
    const responseMessage = axios.isAxiosError(error) ? error.response?.data.message : ""

    switch (status) {
      case 401:
        check401Error(responseMessage)
        break
      case 429:
        setNetworkError({
          title: t("authentication.signIn.accountHasBeenLocked"),
          content: t("authentication.signIn.youHaveToWait"),
        })
        break
      default:
        setNetworkError({
          title: t("errors.somethingWentWrong"),
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
