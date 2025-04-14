import React, { useContext, useEffect, useRef, useState, useCallback } from "react"
import { useForm } from "react-hook-form"
import { t, useMutate } from "@bloom-housing/ui-components"
import { useRouter } from "next/router"
import FormsLayout from "../layouts/forms"
import { fetchJurisdictionByName, useRedirectToPrevPage } from "../lib/hooks"
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
import { UserStatus } from "../lib/constants"
import {
  FeatureFlagEnum,
  Jurisdiction,
  SuccessDTO,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import SignUpBenefits from "../components/account/SignUpBenefits"
import signUpBenefitsStyles from "../../styles/sign-up-benefits.module.scss"
import SignUpBenefitsHeadingGroup from "../components/account/SignUpBenefitsHeadingGroup"
import { isFeatureFlagOn } from "../lib/helpers"

interface SignInProps {
  jurisdiction: Jurisdiction
}

const SignIn = (props: SignInProps) => {
  const { addToast } = useContext(MessageContext)
  const router = useRouter()

  const { login, requestSingleUseCode, userService } = useContext(AuthContext)
  const signUpCopy = process.env.showMandatedAccounts

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

  const {
    mutate: mutateResendConfirmation,
    reset: resetResendConfirmation,
    isLoading: isResendConfirmationLoading,
  } = useMutate<SuccessDTO>()

  const setLocalStorage = () => {
    window.localStorage.setItem(
      "bloom-show-favorites-menu-item",
      (
        isFeatureFlagOn(props.jurisdiction, FeatureFlagEnum.enableListingFavoriting) === true
      ).toString()
    )
  }

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Sign In",
      status: UserStatus.NotLoggedIn,
    })
    if (props.jurisdiction) {
      setLocalStorage()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setLocalStorage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.jurisdiction])

  const onSubmit = async (data: { email: string; password: string }) => {
    const { email, password } = data

    try {
      const user = await login(email, password)
      await redirectToPage()
      addToast(t(`authentication.signIn.success`, { name: user.firstName }), { variant: "success" })
    } catch (error) {
      const { status } = error.response || {}
      determineNetworkError(status, error)
    }
  }

  const onSubmitPwdless = async (data: { email: string; password: string }) => {
    const { email, password } = data

    try {
      if (useCode) {
        clearErrors()
        await requestSingleUseCode(email)
        const redirectUrl = router.query?.redirectUrl as string
        const listingId = router.query?.listingId as string
        let queryParams: { [key: string]: string } = { email, flowType: "login" }
        if (redirectUrl) queryParams = { ...queryParams, redirectUrl }
        if (listingId) queryParams = { ...queryParams, listingId }

        await router.push({
          pathname: "/verify",
          query: queryParams,
        })
      } else {
        const user = await login(email, password)
        addToast(t(`authentication.signIn.success`, { name: user.firstName }), {
          variant: "success",
        })
        await redirectToPage()
      }
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
                />
              ) : (
                <FormSignInDefault
                  onSubmit={(data) => void onSubmit(data)}
                  control={{ register, errors, handleSubmit }}
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
    </>
  )
}

export { SignIn as default, SignIn }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getStaticProps() {
  const jurisdiction = await fetchJurisdictionByName()

  return {
    props: { jurisdiction },
  }
}
