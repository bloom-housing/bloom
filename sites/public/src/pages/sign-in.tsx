import React, { useContext, useEffect, useRef, useState, useCallback } from "react"
import { useForm } from "react-hook-form"
import { t, setSiteAlertMessage, useMutate } from "@bloom-housing/ui-components"
import FormsLayout from "../layouts/forms"
import { useRedirectToPrevPage } from "../lib/hooks"
import {
  PageView,
  pushGtmEvent,
  useCatchNetworkError,
  NetworkStatusType,
  NetworkStatusContent,
  AuthContext,
  FormSignIn,
  ResendConfirmationModal,
} from "@bloom-housing/shared-helpers"
import { UserStatus } from "../lib/constants"
import { EnumUserErrorExtraModelUserErrorMessages } from "@bloom-housing/backend-core/types"
import SignUpBenefits from "../components/account/SignUpBenefits"
import signUpBenefitsStyles from "../../styles/sign-up-benefits.module.scss"
import SignUpBenefitsHeadingGroup from "../components/account/SignUpBenefitsHeadingGroup"

const SignIn = () => {
  const { login, userService } = useContext(AuthContext)
  const signUpCopy = process.env.showMandatedAccounts
  /* Form Handler */
  // This is causing a linting issue with unbound-method, see open issue as of 10/21/2020:
  // https://github.com/react-hook-form/react-hook-form/issues/2887
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, errors, watch, reset } = useForm()
  const redirectToPage = useRedirectToPrevPage("/account/dashboard")
  const { networkError, determineNetworkError, resetNetworkError } = useCatchNetworkError()

  const emailValue = useRef({})
  emailValue.current = watch("email", "")

  const [confirmationStatusModal, setConfirmationStatusModal] = useState<boolean>(false)
  const [confirmationStatusMessage, setConfirmationStatusMessage] = useState<{
    message: NetworkStatusContent
    type: NetworkStatusType
  }>()

  const {
    mutate: mutateResendConfirmation,
    reset: resetResendConfirmation,
    isLoading: isResendConfirmationLoading,
  } = useMutate<{ status: string }>()

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Sign In",
      status: UserStatus.NotLoggedIn,
    })
  }, [])

  const onSubmit = async (data: { email: string; password: string }) => {
    const { email, password } = data

    try {
      const user = await login(email, password)
      setSiteAlertMessage(t(`authentication.signIn.success`, { name: user.firstName }), "success")
      await redirectToPage()
    } catch (error) {
      const { status } = error.response || {}
      determineNetworkError(status, error)
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
    if (
      networkError?.error?.response?.data?.message ===
      EnumUserErrorExtraModelUserErrorMessages.accountNotConfirmed
    ) {
      setConfirmationStatusModal(true)
    }
  }, [networkError])

  return (
    <>
      <FormsLayout className={signUpCopy && "sm:max-w-lg md:max-w-full"}>
        <div className={signUpCopy && signUpBenefitsStyles["benefits-container"]}>
          {signUpCopy && (
            <div className={signUpBenefitsStyles["benefits-display-hide"]}>
              <SignUpBenefitsHeadingGroup mobileView={true} />
            </div>
          )}
          <div className={signUpCopy && signUpBenefitsStyles["benefits-form-container"]}>
            <FormSignIn
              onSubmit={(data) => void onSubmit(data)}
              control={{ register, errors, handleSubmit, watch }}
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
            />
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
    </>
  )
}

export { SignIn as default, SignIn }
