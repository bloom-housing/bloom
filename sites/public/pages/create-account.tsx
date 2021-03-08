import React, { useContext, useRef, useState } from "react"
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
  DOBField,
  AlertBox,
  SiteAlert,
} from "@bloom-housing/ui-components"
import FormsLayout from "../layouts/forms"
import { useRedirectToPrevPage } from "../lib/hooks"
import moment from "moment"

export default () => {
  const { createUser } = useContext(UserContext)
  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, errors, watch } = useForm()
  const [requestError, setRequestError] = useState<string>()
  const email = useRef({})
  const password = useRef({})
  email.current = watch("email", "")
  password.current = watch("password", "")

  const redirectToPrev = useRedirectToPrevPage()
  const onSubmit = async (data) => {
    try {
      const { dob, ...rest } = data
      await createUser({
        ...rest,
        dob: moment(`${dob.birthYear}-${dob.birthMonth}-${dob.birthDay}`),
      })

      await redirectToPrev()
    } catch (err) {
      const { status, data } = err.response || {}
      if (status === 400) {
        switch (data.message) {
          case 'duplicate key value violates unique constraint "user_accounts_email_unique_idx"':
            setRequestError(`${t(`authentication.forgotPassword.errors.${data.message}`)}`)
            break
          default:
            setRequestError(`${t("authentication.forgotPassword.errors.generic")}`)
            break
        }
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
          <Icon size="2xl" symbol="profile" />
          <h2 className="form-card__title">{t("account.createAccount")}</h2>
          {requestError && (
            <AlertBox className="" onClose={() => setRequestError(undefined)} type="alert">
              {requestError}
            </AlertBox>
          )}
          <SiteAlert type="notice" dismissable />
        </div>

        <Form id="create-account" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-card__group border-b">
            <label className="field-label--caps" htmlFor="firstName">
              {t("authentication.createAccount.yourName")}
            </label>

            <Field
              controlClassName="mt-2"
              name="firstName"
              placeholder={t("authentication.createAccount.firstName")}
              validation={{ required: true }}
              error={errors.firstName}
              errorMessage={t("errors.firstNameError")}
              register={register}
            />

            <Field
              name="middleName"
              placeholder={t("authentication.createAccount.middleNameOptional")}
              register={register}
            />

            <Field
              name="lastName"
              placeholder={t("authentication.createAccount.lastName")}
              validation={{ required: true }}
              error={errors.lastName}
              errorMessage={t("errors.lastNameError")}
              register={register}
            />
          </div>

          <div className="form-card__group border-b">
            <DOBField
              register={register}
              required={true}
              error={errors.dob}
              name="dob"
              id="dob"
              watch={watch}
              atAge={true}
              label={t("authentication.createAccount.yourDateOfBirth")}
            />
          </div>

          <div className="form-card__group border-b">
            <Field
              caps={true}
              type="email"
              name="email"
              label={t("authentication.createAccount.email")}
              placeholder="example@web.com"
              validation={{ required: true, pattern: emailRegex }}
              error={errors.email}
              errorMessage={t("authentication.signIn.loginError")}
              register={register}
            />
            <p className="text text-gray-600 text-sm">
              {t("authentication.createAccount.reEnterEmail")}
            </p>
            <Field
              type="email"
              name="emailConfirmation"
              // label={t("authentication.createAccount.email")}
              placeholder="example@web.com"
              validation={{
                validate: (value) =>
                  value === email.current || t("authentication.createAccount.emailMismatch"),
              }}
              error={errors.emailConfirmation}
              errorMessage={t("authentication.createAccount.errors.emailMismatch")}
              register={register}
            />
          </div>

          <div className="form-card__group border-b">
            <Field
              caps={true}
              type="password"
              name="password"
              label={t("authentication.createAccount.password")}
              placeholder={t("authentication.createAccount.mustBe8Chars")}
              validation={{ required: true, minLength: 8 }}
              error={errors.password}
              errorMessage={t("authentication.signIn.passwordError")}
              register={register}
            />
            <p className="text text-gray-600 text-sm">
              {t("authentication.createAccount.reEnterPassword")}
            </p>
            <Field
              type="password"
              name="passwordConfirmation"
              placeholder={t("authentication.createAccount.mustBe8Chars")}
              validation={{
                validate: (value) =>
                  value === password.current || t("authentication.createAccount.passwordMismatch"),
              }}
              error={errors.passwordConfirmation}
              errorMessage={t("authentication.createAccount.errors.passwordMismatch")}
              register={register}
            />

            <div className="text-center mt-10">
              <Button
                styleType={AppearanceStyleType.primary}
                onClick={() => {
                  console.info("button has been clicked!")
                }}
              >
                {t("account.createAccount")}
              </Button>
            </div>
          </div>
        </Form>

        <div className="form-card__group text-center">
          <h2 className="mb-6">{t("account.haveAnAccount")}</h2>

          <LinkButton href="/sign-in">{t("nav.signIn")}</LinkButton>
        </div>
      </FormCard>
    </FormsLayout>
  )
}
