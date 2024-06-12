import { MfaType } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

export enum EnumRenderStep {
  emailAndPassword = "email and password",
  mfaType = "mfa type",
  phoneNumber = "phone number if missing",
  enterCode = "enter mfa code",
}

export const onSubmitEmailAndPassword =
  (
    setEmail,
    setPassword,
    setRenderStep,
    determineNetworkError,
    login,
    router,
    resetNetworkError,
    setLoading,
    reCaptchaEnabled,
    reCaptchaToken,
    setRefreshReCaptcha,
    refreshReCaptcha
  ) =>
  async (data: { email: string; password: string }) => {
    const { email, password } = data
    setLoading(true)
    try {
      await login(
        email,
        password,
        undefined,
        undefined,
        true,
        reCaptchaEnabled ? reCaptchaToken : undefined
      )

      await router.push("/")
      setLoading(false)
    } catch (error) {
      setLoading(false)
      setRefreshReCaptcha(!refreshReCaptcha)

      const sendToMfaFlow = (errorName: string) => {
        return (
          errorName === "mfaCodeIsMissing" ||
          (reCaptchaEnabled &&
            (errorName === "failedReCaptchaToken" ||
              errorName === "failedReCaptchaScore" ||
              errorName === "failedReCaptchaAction"))
        )
      }

      if (sendToMfaFlow(error?.response?.data?.name)) {
        setEmail(email)
        setPassword(password)
        resetNetworkError()
        setRenderStep(EnumRenderStep.mfaType)
      } else {
        const { status } = error.response || {}
        determineNetworkError(status, error)
      }
    }
  }

export const onSubmitMfaType =
  (
    email,
    password,
    setMfaType,
    setRenderStep,
    requestMfaCode,
    determineNetworkError,
    setAllowPhoneNumberEdit,
    setPhoneNumber,
    resetNetworkError
  ) =>
  async (data: { mfaType: MfaType }) => {
    const { mfaType: incomingMfaType } = data
    try {
      const res = await requestMfaCode(email, password, incomingMfaType)
      if (!res.phoneNumberVerified && incomingMfaType === MfaType.sms) {
        setAllowPhoneNumberEdit(true)
        setPhoneNumber(res.phoneNumber)
      }
      setMfaType(incomingMfaType)
      resetNetworkError()
      setRenderStep(EnumRenderStep.enterCode)
    } catch (error) {
      if (error?.response?.data?.name === "phoneNumberMissing") {
        setMfaType(incomingMfaType)
        setRenderStep(EnumRenderStep.phoneNumber)
      } else {
        const { status } = error.response || {}
        determineNetworkError(status, error)
      }
    }
  }

export const onSubmitMfaCodeWithPhone =
  (
    email,
    password,
    mfaType,
    setRenderStep,
    requestMfaCode,
    setAllowPhoneNumberEdit,
    setPhoneNumber,
    resetNetworkError
  ) =>
  async (data: { phoneNumber: string }) => {
    const { phoneNumber } = data
    await requestMfaCode(email, password, mfaType, phoneNumber)
    resetNetworkError()
    setRenderStep(EnumRenderStep.enterCode)
    setAllowPhoneNumberEdit(true)
    setPhoneNumber(phoneNumber)
  }

export const onSubmitMfaCode =
  (email, password, determineNetworkError, login, router, mfaType, resetNetworkError) =>
  async (data: { mfaCode: string }) => {
    const { mfaCode } = data
    try {
      await login(email, password, mfaCode, mfaType, true)
      resetNetworkError()
      await router.push("/")
    } catch (error) {
      const { status } = error.response || {}
      determineNetworkError(status, error, true)
    }
  }
