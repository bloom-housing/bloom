import React, { useEffect, useContext } from "react"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import { t } from "@bloom-housing/ui-components"
import {
  PageView,
  pushGtmEvent,
  useCatchNetworkError,
  AuthContext,
  MessageContext,
  FormForgotPassword,
} from "@bloom-housing/shared-helpers"
import { UserStatus } from "../lib/constants"
import FormsLayout from "../layouts/forms"

const ForgotPassword = () => {
  const router = useRouter()
  const { forgotPassword } = useContext(AuthContext)
  const { addToast } = useContext(MessageContext)

  /* Form Handler */
  // This is causing a linting issue with unbound-method, see open issue as of 10/21/2020:
  // https://github.com/react-hook-form/react-hook-form/issues/2887
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, errors } = useForm()
  const { networkError, determineNetworkError, resetNetworkError } = useCatchNetworkError()

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Forgot Password",
      status: UserStatus.NotLoggedIn,
    })
  }, [])

  const onSubmit = async (data: { email: string }) => {
    const { email } = data
    const listingId = router.query?.listingId as string
    const listingIdRedirect = listingId && process.env.showMandatedAccounts ? listingId : undefined
    try {
      await forgotPassword(email, listingIdRedirect)
    } catch (error) {
      const { status } = error.response || {}
      determineNetworkError(status, error)
    }
    addToast(t(`authentication.forgotPassword.message`), { variant: "primary" })
    await router.push("/sign-in")
  }

  return (
    <FormsLayout>
      <FormForgotPassword
        onSubmit={(data) => void onSubmit(data)}
        control={{ register, errors, handleSubmit }}
        networkError={{
          error: networkError,
          reset: resetNetworkError,
        }}
      />
    </FormsLayout>
  )
}

export { ForgotPassword as default, ForgotPassword }
