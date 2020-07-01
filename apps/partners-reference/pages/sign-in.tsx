import { useState, useContext } from "react"
import { useForm } from "react-hook-form"
import Router from "next/router"
import {
  Button,
  Field,
  FormCard,
  Icon,
  LinkButton,
  ErrorMessage,
  UserContext,
} from "@bloom-housing/ui-components"
import FormsLayout from "../layouts/forms"

export default () => {
  const { login } = useContext(UserContext)
  /* Form Handler */
  const { register, handleSubmit, errors } = useForm()
  const [requestError, setRequestError] = useState<string>()

  const onSubmit = async (data: { email: string; password: string }) => {
    const { email, password } = data

    try {
      await login(email, password)
      Router.push("/")
    } catch (err) {
      const { status } = err.response || {}
      if (status === 401) {
        setRequestError(`Error signing you in: ${err.message}`)
      } else {
        console.error(err)
        setRequestError(
          "There was an error signing you in. Please try again, or contact support for help."
        )
      }
    }
  }

  return (
    <FormsLayout>
      <FormCard>
        <div className="text-center">
          <Icon size="2xl" symbol="profile" />
        </div>
        <h2 className="form-card__title">Sign In</h2>

        <hr />

        <ErrorMessage error={Boolean(requestError)}>{requestError}</ErrorMessage>

        <form id="sign-in" className="px-8 mt-10" onSubmit={handleSubmit(onSubmit)}>
          <Field
            name="email"
            label="Email"
            validation={{ required: true }}
            error={errors.email}
            errorMessage="Please enter your login email"
            register={register}
          />

          <Field
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

        <hr />

        <div className="text-center">
          <h2 className="mb-6">Don't have an account?</h2>

          <LinkButton href="/create-account">Create Account</LinkButton>
        </div>
      </FormCard>
    </FormsLayout>
  )
}
