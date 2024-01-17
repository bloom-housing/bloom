import React, { useContext, useEffect, useRef, useState, useCallback } from "react"
import { useForm } from "react-hook-form"
import { t, setSiteAlertMessage, useMutate, FormSignIn } from "@bloom-housing/ui-components"
import { useRedirectToPrevPage } from "../lib/hooks"
import {
  PageView,
  pushGtmEvent,
  useCatchNetworkError,
  NetworkStatusType,
  NetworkStatusContent,
  AuthContext,
  ResendConfirmationModal,
} from "@bloom-housing/shared-helpers"
import { UserStatus } from "../lib/constants"
import { EnumUserErrorExtraModelUserErrorMessages } from "@bloom-housing/backend-core/types"
import { HeadingGroup } from "@bloom-housing/ui-seeds"
import FormLayout from "../layouts/forms"
import SignUpBenefits from "../components/account/SignUpBenefits"

const SignIn = () => {
  const { login, userService } = useContext(AuthContext)
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
      const { status } = error?.response || {}
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

  const MobileComponent = () => {
    return (
      <>
        <HeadingGroup
          heading={t("account.signUpSaveTime.title")}
          subheading={t("account.signUpSaveTime.subTitle")}
          size="xl"
          className="p-4 -order-1"
        />
        <div className="md:max-w-lg w-full">
          <FormSignIn
            onSubmit={(data) => void onSubmit(data)}
            control={{ register, errors, handleSubmit, watch }}
            networkStatus={{
              content: networkStatusContent,
              type: networkStatusType,
              reset,
            }}
          />
        </div>
        <SignUpBenefits />
      </>
    )
  }

  const DesktopComponent = () => (
    <>
      <div className="max-w-lg w-full">
        <FormSignIn
          onSubmit={(data) => void onSubmit(data)}
          control={{ register, errors, handleSubmit, watch }}
          networkStatus={{
            content: networkStatusContent,
            type: networkStatusType,
            reset,
          }}
        />
      </div>
      <div className="flex flex-col grow-0 shrink-1 p-5 max-w-lg w-full">
        <HeadingGroup
          heading={t("account.signUpSaveTime.title")}
          subheading={t("account.signUpSaveTime.subTitle")}
          size="xl"
          className="grow-0 shrink-1"
        />
        <SignUpBenefits />
      </div>
    </>
  )

  return (
    <>
      <FormLayout className="sm:max-w-lg md:max-w-full">
        <div className="flex flex-col md:flex-row md:ml-20 justify-center">
          <div className="hidden md:flex ">
            <DesktopComponent />
          </div>
          <div className="display md:hidden">
            <MobileComponent />
          </div>
        </div>
      </FormLayout>
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
