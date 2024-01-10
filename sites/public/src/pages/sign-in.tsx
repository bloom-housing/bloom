import React, { useContext, useEffect, useRef, useState, useCallback } from "react"
import { useForm } from "react-hook-form"
import { t, setSiteAlertMessage, useMutate, FormSignIn } from "@bloom-housing/ui-components"
import FormsLayout from "../layouts/forms"
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
import { faStopwatch, faEye, faLock } from "@fortawesome/free-solid-svg-icons"
import { Icon, HeadingGroup } from "@bloom-housing/ui-seeds"

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
      networkError?.error.response.data?.message ===
      EnumUserErrorExtraModelUserErrorMessages.accountNotConfirmed
    ) {
      setConfirmationStatusModal(true)
    }
  }, [networkError])

  const iconListItems = [
    { icon: faStopwatch, text: "Apply faster with saved application details" },
    { icon: faEye, text: "Check on the status of an application at any time" },
    { icon: faLock, text: "Simply reset your password if you forget it" },
  ]
  return (
    <>
      <FormsLayout>
        <div className="flex flex-row w-max">
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
          <div className="w-min mt-6 ml-6">
            <HeadingGroup
              heading={"Sign up quickly and check application status at anytime"}
              subheading={
                "Having an account will save you time by using saved application details, and allow you to check the status of an application at anytime."
              }
              size="xl"
            />
            <ul className="flex flex-col w-min">
              {iconListItems.map((item) => (
                <li className="flex flex-row w-max mb-2 items-center">
                  <Icon
                    icon={item.icon}
                    size="lg"
                    className="border border-white bg-white rounded-full p-1.5 w-max"
                  />
                  <p className="ml-2">{item.text}</p>
                </li>
              ))}
            </ul>
          </div>
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
