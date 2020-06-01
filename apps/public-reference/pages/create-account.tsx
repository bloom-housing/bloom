import { useForm } from "react-hook-form"
import { Button, Field, FormCard, Icon, LinkButton } from "@bloom-housing/ui-components"
import FormsLayout from "../layouts/forms"
import { emailRegex } from "../lib/emailRegex"

export default () => {
  /* Form Handler */
  const { register, handleSubmit, errors } = useForm()
  const onSubmit = (data) => {
    console.log(data)
    alert("Hi " + data.firstname + "! To be continued...")
  }

  return (
    <FormsLayout>
      <FormCard>
        <div className="text-center">
          <Icon size="2xl" symbol="profile" />
        </div>
        <h2 className="form-card__title">Create Account</h2>

        <p className="mt-4 mb-8 text-center text-gray-700 text-tiny px-6">
          You'll use this information to log in to your account, so make sure you can remember it.
        </p>

        <hr />

        <form id="create-account" className="px-8 mt-10" onSubmit={handleSubmit(onSubmit)}>
          <label>Your Name</label>

          <Field
            name="firstname"
            placeholder="First Name"
            validation={{ required: true }}
            error={errors.firstname}
            errorMessage="Please enter a First Name"
            register={register}
          />

          <Field name="middlename" placeholder="Middle Name (optional)" register={register} />

          <Field
            name="lastname"
            placeholder="Last Name"
            validation={{ required: true }}
            error={errors.lastname}
            errorMessage="Please enter a Last Name"
            register={register}
          />

          <hr />

          <label>Your Date of Birth</label>
          <div className="flex">
            <Field
              name="birthmonth"
              placeholder="MM"
              error={errors.birthmonth}
              validation={{ required: true }}
              register={register}
            />
            <Field
              name="birthday"
              placeholder="DD"
              error={errors.birthday}
              validation={{ required: true }}
              register={register}
            />
            <Field
              name="birthyear"
              placeholder="YYYY"
              error={errors.birthyear}
              validation={{ required: true }}
              register={register}
            />
          </div>

          <hr />

          <Field
            type="email"
            name="email"
            label="Email"
            placeholder="example@web.com"
            validation={{ required: true, pattern: emailRegex }}
            error={errors.email}
            errorMessage="Please enter an email address"
            register={register}
          />

          <Field
            type="password"
            name="password"
            label="Password"
            placeholder="Must be 8 characters"
            validation={{ required: true, minLength: 8 }}
            error={errors.password}
            errorMessage="Please enter a valid password"
            register={register}
          />

          <div className="text-center mt-6">
            <Button
              filled={true}
              onClick={() => {
                console.info("button has been clicked!")
              }}
            >
              Create Account
            </Button>
          </div>
        </form>

        <hr />

        <div className="text-center">
          <h2 className="mb-6">Already have an account?</h2>

          <LinkButton href="/sign-in">Sign In</LinkButton>
        </div>
      </FormCard>
    </FormsLayout>
  )
}
