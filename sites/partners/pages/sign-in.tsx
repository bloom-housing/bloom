import React, { useContext, useState } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/router"
import { useCatchNetworkError } from "@bloom-housing/shared-helpers"
import {
  AuthContext,
  FormSignIn,
  FormSignInMFAType,
  FormSignInMFACode,
  FormSignInAddPhone,
} from "@bloom-housing/ui-components"
import FormsLayout from "../layouts/forms"
import { EnumRequestMfaCodeMfaType } from "@bloom-housing/backend-core/types"
import {
  EnumRenderStep,
  onSubmitEmailAndPassword,
  onSubmitMfaType,
  onSubmitMfaCodeWithPhone,
  onSubmitMfaCode,
} from "../lib/signInHelpers"

const SignIn = () => {
  const { login, requestMfaCode } = useContext(AuthContext)
  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, errors, setValue, control } = useForm()
  const { networkError, determineNetworkError, resetNetworkError } = useCatchNetworkError()
  const router = useRouter()
  const [email, setEmail] = useState<string | undefined>(undefined)
  const [password, setPassword] = useState<string | undefined>(undefined)
  const [mfaType, setMfaType] = useState<EnumRequestMfaCodeMfaType | undefined>(undefined)
  const [renderStep, setRenderStep] = useState<EnumRenderStep | undefined>(
    EnumRenderStep.emailAndPassword
  )

  let formToRender: JSX.Element

  if (renderStep === EnumRenderStep.emailAndPassword) {
    formToRender = (
      <FormSignIn
        onSubmit={onSubmitEmailAndPassword(
          setEmail,
          setPassword,
          setRenderStep,
          determineNetworkError,
          login,
          router
        )}
        control={{ register, errors, handleSubmit }}
        networkError={{ error: networkError, reset: resetNetworkError }}
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
          determineNetworkError
        )}
        control={{ register, errors, handleSubmit, setValue }}
        networkError={{ error: networkError, reset: resetNetworkError }}
      />
    )
  } else if (renderStep === EnumRenderStep.phoneNumber) {
    formToRender = (
      <FormSignInAddPhone
        onSubmit={onSubmitMfaCodeWithPhone(email, password, mfaType, setRenderStep, requestMfaCode)}
        control={{ errors, handleSubmit, control }}
        networkError={{ error: networkError, reset: resetNetworkError }}
      />
    )
  } else if (renderStep === EnumRenderStep.enterCode) {
    formToRender = (
      <FormSignInMFACode
        onSubmit={onSubmitMfaCode(email, password, determineNetworkError, login, router)}
        control={{ register, errors, handleSubmit }}
        networkError={{ error: networkError, reset: resetNetworkError }}
        mfaType={mfaType}
      />
    )
  }

  return <FormsLayout>{formToRender}</FormsLayout>
}

export default SignIn
