import React, { useContext } from "react"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import {
  AuthContext,
  t,
  setSiteAlertMessage,
  FormForgotPassword,
} from "@bloom-housing/ui-components"
import FormsLayout from "../layouts/forms"
import { useCatchNetworkError } from "@bloom-housing/shared-helpers"

const ForgotPassword = () => {
  const router = useRouter()
  const { forgotPassword } = useContext(AuthContext)

  /* Form Handler */
  // This is causing a linting issue with unbound-method, see open issue as of 10/21/2020:
  // https://github.com/react-hook-form/react-hook-form/issues/2887
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, errors } = useForm()
  const { networkError, determineNetworkError, resetNetworkError } = useCatchNetworkError()

  const onSubmit = async (data: { email: string }) => {
    const { email } = data

    try {
      await forgotPassword(email)
      setSiteAlertMessage(t(`authentication.forgotPassword.success`), "success")
      await router.push("/")
    } catch (error) {
      const { status } = error.response || {}
      determineNetworkError(status, error)
    }
  }

  return (
    <FormsLayout>
      <FormForgotPassword
        onSubmit={onSubmit}
        control={{ register, errors, handleSubmit }}
        networkError={{
          error: { ...networkError, error: !!networkError?.error },
          reset: resetNetworkError,
        }}
      />
    </FormsLayout>
  )
}

export { ForgotPassword as default, ForgotPassword }
