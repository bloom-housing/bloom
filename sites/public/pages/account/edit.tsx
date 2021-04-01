import React, { useContext } from "react"
import { useForm } from "react-hook-form"
import {
  AppearanceStyleType,
  Button,
  Field,
  FormCard,
  Icon,
  LinkButton,
  UserContext,
  Form,
  emailRegex,
  t,
} from "@bloom-housing/ui-components"
import Link from "next/link"
import FormsLayout from "../../layouts/forms"
import { useRedirectToPrevPage } from "../../lib/hooks"

export default () => {
  // const { createUser } = useContext(UserContext)
  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, errors } = useForm()
  const redirectToPrev = useRedirectToPrevPage()
  const onNameSubmit = async (data) => {
    try {
      const { firstName, middleName, lastName } = data
      // await createUser({
      //   ...rest,
      //   dob: `${birthYear}-${birthMonth}-${birthDay}`,
      // })

      // await redirectToPrev()
    } catch (err) {
      // TODO: better error handling
      const messages = err.response && err.response.data && err.response.data.message
      console.error(messages)
    }
  }

  const onBirthdateSubmit = async (data) => {
    try {
      const { birthDay, birthMonth, birthYear, ...rest } = data
      // await createUser({
      //   ...rest,
      //   dob: `${birthYear}-${birthMonth}-${birthDay}`,
      // })

      // await redirectToPrev()
    } catch (err) {
      // TODO: better error handling
      const messages = err.response && err.response.data && err.response.data.message
      console.error(messages)
    }
  }

  const onEmailSubmit = async (data) => {
    try {
      const { email } = data
      // await createUser({
      //   ...rest,
      //   dob: `${birthYear}-${birthMonth}-${birthDay}`,
      // })

      // await redirectToPrev()
    } catch (err) {
      // TODO: better error handling
      const messages = err.response && err.response.data && err.response.data.message
      console.error(messages)
    }
  }

  const onPasswordSubmit = async (data) => {
    try {
      const { password } = data
      // await createUser({
      //   ...rest,
      //   dob: `${birthYear}-${birthMonth}-${birthDay}`,
      // })

      // await redirectToPrev()
    } catch (err) {
      // TODO: better error handling
      const messages = err.response && err.response.data && err.response.data.message
      console.error(messages)
    }
  }

  return (
    <FormsLayout>
      <FormCard>
        <div className="form-card__lead text-center border-b mx-0">
          <Icon size="2xl" symbol="settings" />
          <h2 className="form-card__title">Account Settings</h2>
        </div>

        <Form id="update-name" onSubmit={handleSubmit(onNameSubmit)}>
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
            <div className="text-center">
              <Button
                onClick={() => {
                  console.log("on button click")
                }}
                className={"items-center"}
              >
                Update
              </Button>
            </div>
          </div>
        </Form>
        <Form id="update-birthdate" onSubmit={handleSubmit(onBirthdateSubmit)}>
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
            <div className="text-center mt-5">
              <Button
                onClick={() => {
                  console.log("on button click")
                }}
                className={"items-center"}
              >
                Update
              </Button>
            </div>
          </div>
        </Form>
        <Form id="update-email" onSubmit={handleSubmit(onEmailSubmit)}>
          <div className="form-card__group border-b">
            <Field
              caps={true}
              type="email"
              name="email"
              label="Email"
              placeholder="example@web.com"
              validation={{ required: true, pattern: emailRegex }}
              error={errors.email}
              errorMessage="Please enter an email address"
              register={register}
            />
            <div className="text-center">
              <Button
                onClick={() => {
                  console.log("on button click")
                }}
                className={"items-center"}
              >
                Update
              </Button>
            </div>
          </div>
        </Form>
        <Form id="update-password" onSubmit={handleSubmit(onPasswordSubmit)}>
          <div className="form-card__group border-b">
            <p className="field-note mb-4">
              {
                "When changing your password make sure you make note of it so you remember it in the future."
              }
            </p>
            <div className={"flex flex-col"}>
              <Field
                caps={true}
                type="password"
                name="password"
                label="Password"
                placeholder="Must be 8 characters"
                validation={{ required: true, minLength: 8 }}
                error={errors.password}
                errorMessage="Please enter a valid password"
                register={register}
                className={"mb-1"}
              />
              <div className="float-left font-bold">
                <Link href="/forgot-password">
                  <a>{t("authentication.signIn.forgotPassword")}</a>
                </Link>
              </div>
            </div>

            <div className="text-center mt-5">
              <Button
                onClick={() => {
                  console.log("on button click")
                }}
                className={"items-center"}
              >
                Update
              </Button>
            </div>
          </div>
        </Form>
      </FormCard>
    </FormsLayout>
  )
}
