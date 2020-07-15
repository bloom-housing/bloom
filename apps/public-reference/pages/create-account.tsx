import { useContext } from "react"
import { useForm } from "react-hook-form"
import {
  Button,
  Field,
  FormCard,
  Icon,
  LinkButton,
  UserContext,
} from "@bloom-housing/ui-components"
import FormsLayout from "../layouts/forms"
import { emailRegex } from "../lib/emailRegex"

export default () => {
  const { createUser } = useContext(UserContext)
  /* Form Handler */
  const { register, handleSubmit, errors } = useForm()

  const onSubmit = async (data) => {
    try {
      const { birthDay, birthMonth, birthYear, ...rest } = data
      const user = await createUser({
        ...rest,
        dob: `${birthYear}-${birthMonth}-${birthDay}`,
      })
      console.log("Created user: %o", user)
    } catch (err) {
      // TODO: better error handling
      const messages = err.response && err.response.data && err.response.data.message
      console.error(messages)
    }
  }

  return (
    <FormsLayout>
      <FormCard>
        <div className="form-card__lead pb-0 text-center">
          <Icon size="2xl" symbol="profile" />
          <h2 className="form-card__title">Create Account</h2>
        </div>

        <div className="form-card__group pt-0 border-b">
          <p className="mt-4 mb-8 text-center text-gray-700 text-tiny px-6">
            You'll use this information to log in to your account, so make sure you can remember it.
          </p>
        </div>

        <form id="create-account" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-card__group border-b">
            <label className="field-label--caps" htmlFor="firstName">
              Your Name
            </label>

            <Field
              controlClassName="mt-2"
              name="firstName"
              placeholder="First Name"
              validation={{ required: true }}
              error={errors.firstName}
              errorMessage="Please enter a First Name"
              register={register}
            />

            <Field name="middleName" placeholder="Middle Name (optional)" register={register} />

            <Field
              name="lastName"
              placeholder="Last Name"
              validation={{ required: true }}
              error={errors.lastName}
              errorMessage="Please enter a Last Name"
              register={register}
            />
          </div>

          <div className="form-card__group border-b">
            <label className="field-label--caps" htmlFor="birthMonth">
              Your Date of Birth
            </label>
            <div className="field-group--dob mt-2">
              <Field
                name="birthMonth"
                placeholder="MM"
                error={errors.birthMonth}
                validation={{ required: true }}
                register={register}
              />
              <Field
                name="birthDay"
                placeholder="DD"
                error={errors.birthDay}
                validation={{ required: true }}
                register={register}
              />
              <Field
                name="birthYear"
                placeholder="YYYY"
                error={errors.birthYear}
                validation={{ required: true }}
                register={register}
              />
            </div>
          </div>

          <div className="form-card__group border-b">
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

            <div className="text-center mt-10">
              <Button
                filled={true}
                onClick={() => {
                  console.info("button has been clicked!")
                }}
              >
                Create Account
              </Button>
            </div>
          </div>
        </form>

        <div className="form-card__group text-center">
          <h2 className="mb-6">Already have an account?</h2>

          <LinkButton href="/sign-in">Sign In</LinkButton>
        </div>
      </FormCard>
    </FormsLayout>
  )
}
