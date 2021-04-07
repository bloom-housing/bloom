import React, { useContext, useState } from "react"
import moment from "moment"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import {
  Button,
  Field,
  FormCard,
  Icon,
  UserContext,
  Form,
  emailRegex,
  t,
  setSiteAlertMessage,
  AlertBox,
  SiteAlert,
} from "@bloom-housing/ui-components"
import Link from "next/link"
import FormsLayout from "../../layouts/forms"

export default () => {
  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, errors } = useForm()
  const router = useRouter()
  const { profile, updatePassword, updateUser, accessToken } = useContext(UserContext)

  const [requestError, setRequestError] = useState<string>()

  const onNameSubmit = async (data: {
    firstName: string
    middleName: string
    lastName: string
  }) => {
    const { firstName, middleName, lastName } = data
    try {
      await updateUser({ ...profile, firstName, middleName, lastName })
      setSiteAlertMessage("Name update successful", "success")
    } catch (err) {
      console.error(err)
      setRequestError(`${t("account.settings.errors.generic")}`)
    }
  }

  const onBirthdateSubmit = async (data: {
    birthDay: string
    birthMonth: string
    birthYear: string
  }) => {
    const { birthDay, birthMonth, birthYear } = data
    try {
      await updateUser({ ...profile, dob: new Date(`${birthYear}-${birthMonth}-${birthDay}`) })
      setSiteAlertMessage("Birthdate update successful", "success")
    } catch (err) {
      console.error(err)
      setRequestError(`${t("account.settings.errors.generic")}`)
    }
  }

  const onEmailSubmit = async (data: { email: string }) => {
    const { email } = data
    try {
      await updateUser({ ...profile, email })
      setSiteAlertMessage("Email update successful", "success")
    } catch (err) {
      console.error(err)
      setRequestError(`${t("account.settings.errors.generic")}`)
    }
  }

  const onPasswordSubmit = async (data: { password: string; passwordConfirmation: string }) => {
    const { password, passwordConfirmation } = data
    try {
      await updatePassword(accessToken, password, passwordConfirmation)
      setSiteAlertMessage(t(`account.settings.passwordSuccess`), "success")
    } catch (err) {
      const { status, data } = err.response || {}
      if (status === 400) {
        setRequestError(`${t(`authentication.forgotPassword.errors.${data.message}`)}`)
      } else {
        console.error(err)
        setRequestError(`${t("authentication.forgotPassword.errors.generic")}`)
      }
    }
  }

  return (
    <FormsLayout>
      <FormCard>
        <div className="form-card__lead text-center border-b mx-0">
          <Icon size="2xl" symbol="settings" />
          <h2 className="form-card__title">Account Settings</h2>
        </div>

        {requestError && (
          <AlertBox className="" onClose={() => setRequestError(undefined)} type="alert">
            {requestError}
          </AlertBox>
        )}
        <SiteAlert type="notice" dismissable />

        <Form id="update-name" onSubmit={handleSubmit(onNameSubmit)}>
          <div className="form-card__group border-b">
            <label className="field-label--caps" htmlFor="firstName">
              Your Name
            </label>

            <Field
              controlClassName="mt-2"
              name="firstName"
              placeholder={"First Name"}
              error={errors.firstName}
              errorMessage="Please enter a First Name"
              register={register}
              defaultValue={profile ? profile.firstName : null}
            />

            <Field
              name="middleName"
              placeholder="Middle Name (optional)"
              register={register}
              defaultValue={profile ? profile.middleName : null}
            />

            <Field
              name="lastName"
              placeholder="Last Name"
              error={errors.lastName}
              errorMessage="Please enter a Last Name"
              register={register}
              defaultValue={profile ? profile.lastName : null}
            />
            <div className="text-center">
              <Button onClick={() => {}} className={"items-center"}>
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
                register={register}
                defaultValue={profile ? moment(new Date(profile.dob)).format("MM") : null}
              />
              <Field
                name="birthDay"
                placeholder="DD"
                error={errors.birthDay}
                register={register}
                defaultValue={profile ? moment(new Date(profile.dob)).format("DD") : null}
              />
              <Field
                name="birthYear"
                placeholder="YYYY"
                error={errors.birthYear}
                register={register}
                defaultValue={profile ? moment(new Date(profile.dob)).format("YYYY") : null}
              />
            </div>
            <div className="text-center mt-5">
              <Button onClick={() => {}} className={"items-center"}>
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
              validation={{ pattern: emailRegex }}
              error={errors.email}
              errorMessage="Please enter an email address"
              register={register}
              defaultValue={profile ? profile.email : null}
            />
            <div className="text-center">
              <Button onClick={() => {}} className={"items-center"}>
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
                name="oldPassword"
                label="Old Password"
                placeholder="Old password"
                validation={{ minLength: 8 }}
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

            <div className="mt-5">
              <Field
                caps={true}
                type="password"
                name="password"
                label="New Password"
                placeholder="Must be 8 characters"
                validation={{ minLength: 8 }}
                error={errors.password}
                errorMessage="Please enter a valid password"
                register={register}
                className={"mb-1"}
              />
            </div>

            <p className="field-note mb-4 mt-4">
              {"Must be at least 8 characters and include at least 1 letter and at least 1 number."}
            </p>

            <div className="mt-5">
              <Field
                caps={true}
                type="password"
                name="passwordConfirmation"
                label="Confirm New Password"
                placeholder="Must be 8 characters"
                validation={{ minLength: 8 }}
                error={errors.password}
                errorMessage="Please enter a valid password"
                register={register}
                className={"mb-1"}
              />
            </div>

            <div className="text-center mt-5">
              <Button onClick={() => {}} className={"items-center"}>
                Update
              </Button>
            </div>
          </div>
        </Form>
      </FormCard>
    </FormsLayout>
  )
}
