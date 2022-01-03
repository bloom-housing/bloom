import React, { useContext } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/router"
import { useCatchNetworkError } from "@bloom-housing/shared-helpers"
import { AuthContext, FormSignIn } from "@bloom-housing/ui-components"
import FormsLayout from "../layouts/forms"

const SignIn = () => {
  const { login } = useContext(AuthContext)
  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, errors } = useForm()
  const { networkError, determineNetworkError, resetNetworkError } = useCatchNetworkError()
  const router = useRouter()

  const onSubmit = async (data: { email: string; password: string }) => {
    const { email, password } = data

    try {
      await login(email, password)
      await router.push("/")
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
      />
    </FormsLayout>
  )
}

export default SignIn
