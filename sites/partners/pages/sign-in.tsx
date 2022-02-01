import React, { useContext, useState, useCallback, useMemo } from "react"
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

enum EnumRenderStep {
  emailAndPassword = "email and password",
  mfaType = "mfa type",
  phoneNumber = "phone number if missing",
  enterCode = "enter mfa code",
}

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

  const onSubmitEmailAndPassword = useCallback(
    async (data: { email: string; password: string }) => {
      const { email, password } = data
      try {
        await login(email, password)
        await router.push("/")
      } catch (error) {
        if (error?.response?.data?.name === "mfaCodeIsMissing") {
          setEmail(email)
          setPassword(password)
          setRenderStep(EnumRenderStep.mfaType)
        } else {
          const { status } = error.response || {}
          determineNetworkError(status, error)
        }
      }
    },
    [setEmail, setPassword, setRenderStep, determineNetworkError, login, router]
  )

  const onSubmitMfaType = useCallback(
    async (data: { mfaType: EnumRequestMfaCodeMfaType }) => {
      const { mfaType: incomingMfaType } = data
      try {
        await requestMfaCode(email, password, incomingMfaType)
        setMfaType(incomingMfaType)
        setRenderStep(EnumRenderStep.enterCode)
      } catch (error) {
        if (error?.response?.data?.name === "phoneNumberMissing") {
          setMfaType(incomingMfaType)
          setRenderStep(EnumRenderStep.phoneNumber)
        }
      }
    },
    [email, password, setMfaType, setRenderStep, requestMfaCode]
  )

  const onSubmitMfaCodeWithPhone = useCallback(
    async (data: { phoneNumber: string }) => {
      const { phoneNumber } = data
      await requestMfaCode(email, password, mfaType, phoneNumber)
      setRenderStep(EnumRenderStep.enterCode)
    },
    [email, password, mfaType, setRenderStep, requestMfaCode]
  )

  const onSubmitMfaCode = useCallback(
    async (data: { mfaCode: string }) => {
      const { mfaCode } = data
      try {
        await login(email, password, mfaCode)
        await router.push("/")
      } catch (error) {
        const { status } = error.response || {}
        determineNetworkError(status, error, true)
      }
    },
    [email, password, determineNetworkError, login, router]
  )

  const formToRender = useMemo(() => {
    if (renderStep === EnumRenderStep.emailAndPassword) {
      return (
        <FormSignIn
          onSubmit={onSubmitEmailAndPassword}
          control={{ register, errors, handleSubmit }}
          networkError={{ error: networkError, reset: resetNetworkError }}
        />
      )
    } else if (renderStep === EnumRenderStep.mfaType) {
      return (
        <FormSignInMFAType
          onSubmit={onSubmitMfaType}
          control={{ register, errors, handleSubmit, setValue }}
          networkError={{ error: networkError, reset: resetNetworkError }}
        />
      )
    } else if (renderStep === EnumRenderStep.phoneNumber) {
      return (
        <FormSignInAddPhone
          onSubmit={onSubmitMfaCodeWithPhone}
          control={{ errors, handleSubmit, control }}
          networkError={{ error: networkError, reset: resetNetworkError }}
        />
      )
    } else if (renderStep === EnumRenderStep.enterCode) {
      return (
        <FormSignInMFACode
          onSubmit={onSubmitMfaCode}
          control={{ register, errors, handleSubmit }}
          networkError={{ error: networkError, reset: resetNetworkError }}
        />
      )
    }
  }, [
    renderStep,
    onSubmitEmailAndPassword,
    onSubmitMfaType,
    onSubmitMfaCode,
    onSubmitMfaCodeWithPhone,
    control,
    errors,
    handleSubmit,
    networkError,
    register,
    resetNetworkError,
    setValue,
  ])

  return <FormsLayout>{formToRender}</FormsLayout>
}

export default SignIn
