import React, { useContext, useEffect, useRef, useState, useCallback } from "react"
import axios from "axios"
import { useRouter } from "next/router"
import { GoogleReCaptcha } from "react-google-recaptcha-v3"
import { useForm } from "react-hook-form"
import { SuccessDTO } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import {
  PageView,
  pushGtmEvent,
  useCatchNetworkError,
  NetworkStatusType,
  NetworkStatusContent,
  AuthContext,
  MessageContext,
  FormSignIn,
  ResendConfirmationModal,
  FormSignInDefault,
  FormSignInPwdless,
} from "@bloom-housing/shared-helpers"
import { t, useMutate } from "@bloom-housing/ui-components"
import SignUpBenefits from "../components/account/SignUpBenefits"
import SignUpBenefitsHeadingGroup from "../components/account/SignUpBenefitsHeadingGroup"
import TermsModal, { FormSignInValues } from "../components/shared/TermsModal"
import FormsLayout from "../layouts/forms"
import { UserStatus } from "../lib/constants"
import { useRedirectToPrevPage } from "../lib/hooks"
import signUpBenefitsStyles from "../../styles/sign-up-benefits.module.scss"

const SignIn = () => {
  const { addToast } = useContext(MessageContext)
  const router = useRouter()

  const { login, requestSingleUseCode, userService } = useContext(AuthContext)
  const signUpCopy = process.env.showMandatedAccounts
  const reCaptchaEnabled = !!process.env.reCaptchaKey

  /* Form Handler */
  // This is causing a linting issue with unbound-method, see open issue as of 10/21/2020:
  // https://github.com/react-hook-form/react-hook-form/issues/2887
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, errors, watch, reset, clearErrors } = useForm()
  const redirectToPage = useRedirectToPrevPage("/account/dashboard")
  const { networkError, determineNetworkError, resetNetworkError } = useCatchNetworkError()

  const emailValue = useRef({})
  emailValue.current = watch("email", "")

  const [confirmationStatusModal, setConfirmationStatusModal] = useState<boolean>(false)
  const [confirmationStatusMessage, setConfirmationStatusMessage] = useState<{
    message: NetworkStatusContent
    type: NetworkStatusType
  }>()

  type LoginType = "pwd" | "code"
  const loginType = router.query?.loginType as LoginType

  const [useCode, setUseCode] = useState(loginType !== "pwd")
  const [loading, setLoading] = useState(false)
  const [reCaptchaToken, setReCaptchaToken] = useState(null)
  const [refreshReCaptcha, setRefreshReCaptcha] = useState(false)
  const [openTermsModal, setOpenTermsModal] = useState<boolean>(false)
  const [notChecked, setChecked] = useState(true)

  const {
    mutate: mutateResendConfirmation,
    reset: resetResendConfirmation,
    isLoading: isResendConfirmationLoading,
  } = useMutate<SuccessDTO>()

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Sign In",
      status: UserStatus.NotLoggedIn,
    })
  }, [])

  const onVerify = useCallback((token) => {
    setReCaptchaToken(token)
  }, [])

  const singleUseCodeFlow = async (email: string, reCaptcha?: boolean) => {
    clearErrors()
    try {
      await requestSingleUseCode(email)
      const redirectUrl = router.query?.redirectUrl as string
      const listingId = router.query?.listingId as string
      let queryParams: { [key: string]: string } = {
        email,
        flowType: reCaptcha ? "loginReCaptcha" : "login",
      }
      if (redirectUrl) queryParams = { ...queryParams, redirectUrl }
      if (listingId) queryParams = { ...queryParams, listingId }

      await router.push({
        pathname: "/verify",
        query: queryParams,
      })
    } catch (error) {
      setLoading(false)
      const { status } = error.response || {}
      determineNetworkError(status, error)
    }
  }

  const sendToReCaptchaFlow = (errorName: string) => {
    return (
      reCaptchaEnabled &&
      (errorName === "failedReCaptchaToken" ||
        errorName === "failedReCaptchaScore" ||
        errorName === "failedReCaptchaAction")
    )
  }

  const onSubmit = async (data: { email: string; password: string }) => {
    setLoading(true)
    const { email, password } = data

    try {
      const user = await login(
        email,
        password,
        undefined,
        undefined,
        undefined,
        reCaptchaEnabled ? reCaptchaToken : undefined,
        !notChecked ? true : undefined
      )
      await redirectToPage()
      addToast(t(`authentication.signIn.success`, { name: user.firstName }), { variant: "success" })
    } catch (error) {
      setLoading(false)
      if (sendToReCaptchaFlow(error.response.data.name)) {
        await singleUseCodeFlow(email, true)
      }
      const { status } = error.response || {}
      const responseMessage = axios.isAxiosError(error) ? error.response?.data.message : ""
      if (status === 400 && responseMessage?.includes("has not accepted the terms of service")) {
        setOpenTermsModal(true)
      } else {
        determineNetworkError(status, error)
      }
      setRefreshReCaptcha(!refreshReCaptcha)
    }
  }

  const onSubmitPwdless = async (data: { email: string; password: string }) => {
    setLoading(true)
    const { email, password } = data

    if (useCode) {
      await singleUseCodeFlow(email)
    } else {
      try {
        const user = await login(
          email,
          password,
          undefined,
          undefined,
          undefined,
          reCaptchaEnabled ? reCaptchaToken : undefined,
          !notChecked ? true : undefined
        )
        addToast(t(`authentication.signIn.success`, { name: user.firstName }), {
          variant: "success",
        })
        await redirectToPage()
      } catch (error) {
        setLoading(false)
        setOpenTermsModal(false)
        setChecked(true)
        if (sendToReCaptchaFlow(error.response.data.name)) {
          await singleUseCodeFlow(email, true)
        }
        const { status } = error.response || {}
        const responseMessage = axios.isAxiosError(error) ? error.response?.data.message : ""
        if (status === 400 && responseMessage?.includes("has not accepted the terms of service")) {
          setOpenTermsModal(true)
        } else {
          determineNetworkError(status, error)
        }
        setRefreshReCaptcha(!refreshReCaptcha)
      }
    }
  }

  const onResendConfirmationSubmit = useCallback(
    (email: string) => {
      void mutateResendConfirmation(
        () =>
          userService.resendConfirmation({
            body: {
              email: email,
              appUrl: window.location.origin,
            },
          }),
        {
          onSuccess: () => {
            setConfirmationStatusMessage({
              message: {
                title: "",
                description: t("authentication.createAccount.emailSent"),
              },
              type: "success",
            })
            setConfirmationStatusModal(false)
          },
          onError: (err) => {
            setConfirmationStatusMessage({
              message: {
                title: t("errors.somethingWentWrong"),
                description: t("authentication.signIn.errorGenericMessage"),
                error: err,
              },
              type: "alert",
            })
            setConfirmationStatusModal(false)
          },
        }
      )
    },
    [mutateResendConfirmation, userService]
  )

  const networkStatusContent = (() => {
    // the confirmation modal is active, do not show any alert
    if (confirmationStatusModal) return undefined

    // the confirmation form has been sent, show success or error
    if (confirmationStatusMessage) return confirmationStatusMessage?.message

    // show default sign-in form network status
    return networkError
  })()

  const networkStatusType = (() => {
    if (confirmationStatusModal) return undefined
    if (confirmationStatusMessage) return confirmationStatusMessage?.type
    return undefined
  })()

  useEffect(() => {
    if (networkError?.error?.response?.data?.message?.includes("but is not confirmed")) {
      setConfirmationStatusModal(true)
    }
  }, [networkError])

  return (
    <>
      <FormsLayout className={signUpCopy ? "sm:max-w-lg md:max-w-full" : undefined}>
        <div className={signUpCopy ? signUpBenefitsStyles["benefits-container"] : undefined}>
          {signUpCopy && (
            <div className={signUpBenefitsStyles["benefits-display-hide"]}>
              <SignUpBenefitsHeadingGroup mobileView={true} />
            </div>
          )}
          <div className={signUpCopy ? signUpBenefitsStyles["benefits-form-container"] : undefined}>
            <FormSignIn
              networkStatus={{
                content: networkStatusContent,
                type: networkStatusType,
                reset: () => {
                  reset()
                  resetNetworkError()
                  setConfirmationStatusMessage(undefined)
                },
              }}
              showRegisterBtn={true}
              control={{ errors }}
            >
              {process.env.showPwdless ? (
                <FormSignInPwdless
                  onSubmit={(data) => void onSubmitPwdless(data)}
                  control={{ register, errors, handleSubmit }}
                  useCode={useCode}
                  setUseCode={setUseCode}
                  loading={loading}
                />
              ) : (
                <FormSignInDefault
                  onSubmit={(data) => void onSubmit(data)}
                  control={{ register, errors, handleSubmit }}
                  loading={loading}
                />
              )}
            </FormSignIn>
          </div>
          {signUpCopy && (
            <div className={signUpBenefitsStyles["benefits-hide-display"]}>
              <div className={signUpBenefitsStyles["benefits-desktop-container"]}>
                <SignUpBenefitsHeadingGroup mobileView={false} />
                <SignUpBenefits idTag="desktop" />
              </div>
            </div>
          )}
          {signUpCopy && (
            <div className={signUpBenefitsStyles["benefits-display-hide"]}>
              <SignUpBenefits idTag="mobile" />
            </div>
          )}
        </div>
      </FormsLayout>

      <ResendConfirmationModal
        isOpen={confirmationStatusModal}
        onClose={() => {
          setConfirmationStatusModal(false)
          resetResendConfirmation()
          resetNetworkError()
        }}
        initialEmailValue={emailValue.current as string}
        onSubmit={(email) => onResendConfirmationSubmit(email)}
        loadingMessage={isResendConfirmationLoading && t("t.formSubmitted")}
      />
      {reCaptchaEnabled && (
        <GoogleReCaptcha onVerify={onVerify} refreshReCaptcha={refreshReCaptcha} action={"login"} />
      )}
      <TermsModal
        control={{ register, errors, handleSubmit }}
        onSubmit={(data) => void onSubmitPwdless(data as FormSignInValues)}
        notChecked={notChecked}
        setChecked={setChecked}
        openTermsModal={openTermsModal}
        setOpenTermsModal={setOpenTermsModal}
      />
    </>
  )
}

export { SignIn as default, SignIn }
