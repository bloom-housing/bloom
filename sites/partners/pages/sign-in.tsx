import React, { useContext, useState, useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/router"
import {
  useCatchNetworkError,
  NetworkStatusType,
  NetworkStatusContent,
} from "@bloom-housing/shared-helpers"
import {
  AuthContext,
  FormSignIn,
  FormSignInMFAType,
  FormSignInMFACode,
  FormSignInAddPhone,
  t,
} from "@bloom-housing/ui-components"
import FormsLayout from "../layouts/forms"
import {
  EnumRequestMfaCodeMfaType,
  EnumUserErrorExtraModelUserErrorMessages,
} from "@bloom-housing/backend-core/types"
import {
  EnumRenderStep,
  onSubmitEmailAndPassword,
  onSubmitMfaType,
  onSubmitMfaCodeWithPhone,
  onSubmitMfaCode,
} from "../lib/signInHelpers"
import { ConfirmationModal } from "../src/ConfirmationModal"

const SignIn = () => {
  const { login, requestMfaCode } = useContext(AuthContext)
  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, errors, setValue, control, watch, reset } = useForm()
  const { networkError, determineNetworkError, resetNetworkError } = useCatchNetworkError()
  const router = useRouter()
  const [email, setEmail] = useState<string | undefined>(undefined)
  const [password, setPassword] = useState<string | undefined>(undefined)
  const [mfaType, setMfaType] = useState<EnumRequestMfaCodeMfaType | undefined>(undefined)
  const [renderStep, setRenderStep] = useState<EnumRenderStep | undefined>(
    EnumRenderStep.emailAndPassword
  )
  const [allowPhoneNumberEdit, setAllowPhoneNumberEdit] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")

  const emailValue = useRef({})
  emailValue.current = watch("email", "")

  const [confirmationStatusModal, setConfirmationStatusModal] = useState<boolean>(false)
  const [confirmationStatusMessage, setConfirmationStatusMessage] = useState<{
    message: NetworkStatusContent
    type: NetworkStatusType
  }>()

  useEffect(() => {
    if (
      networkError?.error.response.data?.message ===
      EnumUserErrorExtraModelUserErrorMessages.accountNotConfirmed
    ) {
      setConfirmationStatusModal(true)
    }
  }, [networkError])

  let formToRender: JSX.Element

  if (Object.keys(errors).length && !!networkError) {
    resetNetworkError()
  }

  if (renderStep === EnumRenderStep.emailAndPassword) {
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

    formToRender = (
      <FormSignIn
        onSubmit={onSubmitEmailAndPassword(
          setEmail,
          setPassword,
          setRenderStep,
          determineNetworkError,
          login,
          router,
          resetNetworkError
        )}
        control={{ register, errors, handleSubmit }}
        networkStatus={{
          content: networkStatusContent,
          type: networkStatusType,
          reset: () => {
            reset()
            resetNetworkError()
            setConfirmationStatusMessage(undefined)
          },
        }}
      />
    )
  } else if (renderStep === EnumRenderStep.mfaType) {
    formToRender = (
      <FormSignInMFAType
        onSubmit={onSubmitMfaType(
          email,
          password,
          setMfaType,
          setRenderStep,
          requestMfaCode,
          determineNetworkError,
          setAllowPhoneNumberEdit,
          setPhoneNumber,
          resetNetworkError
        )}
        control={{ register, errors, handleSubmit, setValue }}
        networkError={{ content: networkError, reset: resetNetworkError }}
      />
    )
  } else if (renderStep === EnumRenderStep.phoneNumber) {
    formToRender = (
      <FormSignInAddPhone
        onSubmit={onSubmitMfaCodeWithPhone(
          email,
          password,
          mfaType,
          setRenderStep,
          requestMfaCode,
          setAllowPhoneNumberEdit,
          setPhoneNumber,
          resetNetworkError
        )}
        control={{ errors, handleSubmit, control }}
        networkError={{ content: networkError, reset: resetNetworkError }}
        phoneNumber={phoneNumber}
      />
    )
  } else if (renderStep === EnumRenderStep.enterCode) {
    formToRender = (
      <FormSignInMFACode
        onSubmit={onSubmitMfaCode(
          email,
          password,
          determineNetworkError,
          login,
          router,
          mfaType,
          resetNetworkError
        )}
        control={{ register, errors, handleSubmit }}
        networkError={{ content: networkError, reset: resetNetworkError }}
        mfaType={mfaType}
        allowPhoneNumberEdit={allowPhoneNumberEdit}
        phoneNumber={phoneNumber}
        goBackToPhone={() => setRenderStep(EnumRenderStep.phoneNumber)}
      />
    )
  }

  return (
    <>
      <ConfirmationModal
        isOpen={confirmationStatusModal}
        onSuccess={() => {
          setConfirmationStatusMessage({
            message: {
              title: "",
              description: t("authentication.createAccount.emailSent"),
            },
            type: "success",
          })
          setConfirmationStatusModal(false)
        }}
        onError={(err) => {
          setConfirmationStatusMessage({
            message: {
              title: t("errors.somethingWentWrong"),
              description: t("authentication.signIn.errorGenericMessage"),
              error: err,
            },
            type: "alert",
          })
          setConfirmationStatusModal(false)
        }}
        onClose={() => setConfirmationStatusModal(false)}
        initialEmailValue={emailValue.current as string}
      />
      <FormsLayout>{formToRender}</FormsLayout>
    </>
  )
}

export default SignIn
