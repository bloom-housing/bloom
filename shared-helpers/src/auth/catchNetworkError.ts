import { useState } from "react"
import { t, AlertTypes } from "@bloom-housing/ui-components"
import { AxiosError, isAxiosError } from "axios"

export type NetworkStatus = {
  content: NetworkStatusContent
  type?: NetworkStatusType
  reset: NetworkErrorReset
}

export type NetworkStatusType = AlertTypes

export type NetworkStatusError = AxiosError

type CatchNetworkError = {
  failureCountRemaining?: number
  message?: string
  name?: string
}

export type NetworkStatusContent = {
  title: string
  description: string
  error?: AxiosError<CatchNetworkError>
} | null

export type NetworkErrorDetermineError = (
  status: number,
  error: AxiosError,
  mfaEnabled?: boolean
) => void

export type NetworkErrorReset = () => void

export enum NetworkErrorMessage {
  PasswordOutdated = "but password is no longer valid",
  MfaUnauthorized = "mfaUnauthorized",
  SingleUseCodeUnauthorized = "singleUseCodeUnauthorized",
  MfaPublicSite = "A user with MFA required is attempting to login to the public site",
  mfaCodeIsMissing = "mfaCodeIsMissing",
}

/**
 * This helper can be used in the catch part for each network request. It determines a proper title and message for AlertBox + AlertNotice components depending on error status code.
 */
export const useCatchNetworkError = () => {
  const [networkError, setNetworkError] = useState<NetworkStatusContent>(null)

  const check401Error = (message: string, error: AxiosError<CatchNetworkError>) => {
    if (message?.includes(NetworkErrorMessage.PasswordOutdated)) {
      setNetworkError({
        title: t("authentication.signIn.passwordOutdated"),
        description: `${t(
          "authentication.signIn.changeYourPassword"
        )} <a href="/forgot-password">${t("t.here")}</a>`,
        error,
      })
    } else if (message === NetworkErrorMessage.MfaUnauthorized) {
      setNetworkError({
        title: t("authentication.signIn.enterValidEmailAndPasswordAndMFA"),
        description: t("authentication.signIn.afterFailedAttempts", {
          count: error?.response?.data?.failureCountRemaining || 5,
        }),
        error,
      })
    } else if (message === NetworkErrorMessage.SingleUseCodeUnauthorized) {
      setNetworkError({
        title: t("authentication.signIn.pwdless.error"),
        description: t("authentication.signIn.afterFailedAttempts", {
          count: error?.response?.data?.failureCountRemaining || 5,
        }),
        error,
      })
    } else if (error?.response?.data?.name === NetworkErrorMessage.mfaCodeIsMissing) {
      setNetworkError({
        title: t("errors.somethingWentWrong"),
        description: t("authentication.signIn.mfaError"),
        error,
      })
    } else {
      setNetworkError({
        title: t("authentication.signIn.enterValidEmailAndPassword"),
        description: t("authentication.signIn.afterFailedAttempts", {
          count: error?.response?.data?.failureCountRemaining || 5,
        }),
        error,
      })
    }
  }

  const check403Error = (message: string, error: AxiosError<CatchNetworkError>) => {
    if (message === NetworkErrorMessage.MfaPublicSite) {
      setNetworkError({
        title: t("errors.somethingWentWrong"),
        description: t("authentication.signIn.mfaError"),
        error,
      })
    } else {
      setNetworkError({
        title: t("errors.somethingWentWrong"),
        description: t("authentication.signIn.errorGenericMessage"),
        error,
      })
    }
  }

  const determineNetworkError: NetworkErrorDetermineError = (
    status,
    error: AxiosError<CatchNetworkError>
  ) => {
    const responseMessage = isAxiosError(error) ? error.response?.data.message || "" : ""
    switch (status) {
      case 401:
        check401Error(responseMessage, error)
        break
      case 403:
        check403Error(responseMessage, error)
        break
      case 429:
        setNetworkError({
          title: t("authentication.signIn.accountHasBeenLocked"),
          description: t("authentication.signIn.youHaveToWait"),
          error,
        })
        break
      default:
        setNetworkError({
          title: t("errors.somethingWentWrong"),
          description: t("authentication.signIn.errorGenericMessage"),
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
