import { EnumRequestMfaCodeMfaType } from "@bloom-housing/backend-core/types"

export enum EnumRenderStep {
  emailAndPassword = "email and password",
  mfaType = "mfa type",
  phoneNumber = "phone number if missing",
  enterCode = "enter mfa code",
}

export const onSubmitEmailAndPassword = (
  setEmail,
  setPassword,
  setRenderStep,
  determineNetworkError,
  login,
  router
) => async (data: { email: string; password: string }) => {
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
}

export const onSubmitMfaType = (
  email,
  password,
  setMfaType,
  setRenderStep,
  requestMfaCode,
  determineNetworkError,
  setAllowPhoneNumberEdit,
  setPhoneNumber
) => async (data: { mfaType: EnumRequestMfaCodeMfaType }) => {
  const { mfaType: incomingMfaType } = data
  try {
    const res = await requestMfaCode(email, password, incomingMfaType)
    if (!res.phoneNumberVerified && incomingMfaType === EnumRequestMfaCodeMfaType.sms) {
      setAllowPhoneNumberEdit(true)
      setPhoneNumber(res.phoneNumber)
    }
    setMfaType(incomingMfaType)
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

export const onSubmitMfaCodeWithPhone = (
  email,
  password,
  mfaType,
  setRenderStep,
  requestMfaCode,
  setAllowPhoneNumberEdit,
  setPhoneNumber
) => async (data: { phoneNumber: string }) => {
  const { phoneNumber } = data
  await requestMfaCode(email, password, mfaType, phoneNumber)
  setRenderStep(EnumRenderStep.enterCode)
  setAllowPhoneNumberEdit(true)
  setPhoneNumber(phoneNumber)
}

export const onSubmitMfaCode = (
  email,
  password,
  determineNetworkError,
  login,
  router,
  mfaType
) => async (data: { mfaCode: string }) => {
  const { mfaCode } = data
  try {
    await login(email, password, mfaCode, mfaType)
    await router.push("/")
  } catch (error) {
    const { status } = error.response || {}
    determineNetworkError(status, error, true)
  }
}
