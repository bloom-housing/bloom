import React, { useContext, useState } from "react"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import { t } from "@bloom-housing/ui-components"
import FormsLayout from "../layouts/forms"
import {
  useCatchNetworkError,
  AuthContext,
  MessageContext,
  FormForgotPassword,
} from "@bloom-housing/shared-helpers"

const ForgotPassword = () => {
  const router = useRouter()
  const { forgotPassword } = useContext(AuthContext)
  const { addToast } = useContext(MessageContext)
  const [isLoading, setIsLoading] = useState(false)

  /* Form Handler */
  // This is causing a linting issue with unbound-method, see open issue as of 10/21/2020:
  // https://github.com/react-hook-form/react-hook-form/issues/2887
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, errors } = useForm()
  const { networkError, determineNetworkError, resetNetworkError } = useCatchNetworkError()

  const onSubmit = async (data: { email: string }) => {
    const { email } = data
    try {
      setIsLoading(true)
      await forgotPassword(email)
    } catch (error) {
      const { status } = error.response || {}
      determineNetworkError(status, error)
    } finally {
      setIsLoading(false)
    }
    addToast(t(`authentication.forgotPassword.message`), { variant: "primary" })
    await router.push("/sign-in")
  }

  return (
    <FormsLayout title={`Forgot Password - ${t("nav.siteTitlePartners")}`}>
      <FormForgotPassword
        onSubmit={onSubmit}
        control={{ register, errors, handleSubmit }}
        networkError={{
          error: networkError,
          reset: resetNetworkError,
        }}
        loading={isLoading}
      />
    </FormsLayout>
  )
}

export { ForgotPassword as default, ForgotPassword }
