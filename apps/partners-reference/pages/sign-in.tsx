import { useState, useContext } from "react"
import { useForm } from "react-hook-form"
import Router from "next/router"
import {
  Button,
  Field,
  FormCard,
  Icon,
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
        <div className="form-card__lead text-center border-b mx-0">
          <Icon size="2xl" symbol="profile" />
          <h2 className="form-card__title">Partners Sign In</h2>
        </div>
        <div className="form-card__group pt-0 border-b">
          <ErrorMessage error={Boolean(requestError)}>{requestError}</ErrorMessage>

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
      </FormCard>
    </FormsLayout>
  )
}
