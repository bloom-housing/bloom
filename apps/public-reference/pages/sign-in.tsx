import { useForm } from "react-hook-form"
import { Button, Field, FormCard, Icon, LinkButton } from "@bloom-housing/ui-components"
import FormsLayout from "../layouts/forms"

export default () => {
  /* Form Handler */
  const { register, handleSubmit, errors } = useForm()
  const onSubmit = (data) => {
    console.log(data)
    alert("Hi " + data.email + "! To be continued...")
  }

  return (
    <FormsLayout>
      <FormCard>
        <div className="text-center">
          <Icon size="2xl" symbol="profile" />
        </div>
        <h2 className="form-card__title">Sign In</h2>

        <hr />

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
          />

          <div className="text-center mt-6">
            <Button
              filled={true}
              onClick={() => {
                console.info("button has been clicked!")
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
