import React, { useContext } from "react"
import { useForm } from "react-hook-form"
import { AuthContext, t, setSiteAlertMessage, FormSignIn } from "@bloom-housing/ui-components"
import FormsLayout from "../layouts/forms"
import { useRedirectToPrevPage } from "../lib/hooks"
import { useCatchNetworkError } from "@bloom-housing/shared-helpers"

const SignIn = () => {
  const { login } = useContext(AuthContext)
  /* Form Handler */
  // This is causing a linting issue with unbound-method, see open issue as of 10/21/2020:
  // https://github.com/react-hook-form/react-hook-form/issues/2887
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, errors } = useForm()
  const redirectToPage = useRedirectToPrevPage("/account/dashboard")
  const { networkError, determineNetworkError, resetNetworkError } = useCatchNetworkError()

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

  return (
    <FormsLayout>
      <FormSignIn
        onSubmit={onSubmit}
        control={{ register, errors, handleSubmit }}
        networkError={{ error: networkError, reset: resetNetworkError }}
        showRegisterBtn={true}
      />
    </FormsLayout>
  )
}

export { SignIn as default, SignIn }
