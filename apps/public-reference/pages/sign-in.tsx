import { useState, useContext } from "react"
import { useForm } from "react-hook-form"
import {
  Button,
  Field,
  FormCard,
  Icon,
  LinkButton,
  UserContext,
  t,
  AlertBox,
  UrlAlert,
} from "@bloom-housing/ui-components"
import FormsLayout from "../layouts/forms"
import { useRedirectToPrevPage } from "../lib/hooks"

const SignIn = () => {
  const { login } = useContext(UserContext)
  const redirectToPrev = useRedirectToPrevPage()
  /* Form Handler */
  const { register, handleSubmit, errors } = useForm()
  const [requestError, setRequestError] = useState<string>()

  const onSubmit = async (data: { email: string; password: string }) => {
    const { email, password } = data

    try {
      const user = await login(email, password)

      redirectToPrev({
        success: `${encodeURIComponent(
          t(`authentication.signIn.success`, { name: user.firstName })
        )}`,
      })
    } catch (err) {
      const { status } = err.response || {}
      if (status === 401) {
        setRequestError(`${t("authentication.signIn.error")}: ${err.message}`)
      } else {
        console.error(err)
        setRequestError(
          `${t("authentication.signIn.error")}. ${t("authentication.signIn.errorGenericMessage")}`
        )
      }
    }
  }

  return (
    <FormsLayout>
      <FormCard>
        <div className="form-card__lead text-center border-b mx-0">
          <Icon size="2xl" symbol="profile" />
          <h2 className="form-card__title">Sign In</h2>
        </div>
        {requestError && (
          <AlertBox className="" onClose={() => setRequestError(undefined)} type="alert">
            {requestError}
          </AlertBox>
        )}
        <UrlAlert type="notice" urlParam="message" dismissable />
        <div className="form-card__group pt-0 border-b">
          <form id="sign-in" className="mt-10" onSubmit={handleSubmit(onSubmit)}>
            <Field
              caps={true}
              name="email"
              label="Email"
              validation={{ required: true }}
              error={errors.email}
              errorMessage="Please enter your login email"
              register={register}
            />

            <Field
              caps={true}
              name="password"
              label="Password"
              validation={{ required: true }}
              error={errors.password}
              errorMessage="Please enter your login password"
              register={register}
              type="password"
            />

            <div className="text-center mt-6">
              <Button
                filled={true}
                onClick={() => {
                  //
                }}
              >
                Sign In
              </Button>
            </div>
          </form>
        </div>
        <div className="form-card__group text-center">
          <h2 className="mb-6">Don't have an account?</h2>

          <LinkButton href="/create-account">Create Account</LinkButton>
        </div>
      </FormCard>
    </FormsLayout>
  )
}

export { SignIn as default, SignIn }
