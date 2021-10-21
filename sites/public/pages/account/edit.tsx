import React, { useContext, useState, useRef } from "react"
import moment from "moment"
import { useForm } from "react-hook-form"
import {
  Button,
  Field,
  FormCard,
  Icon,
  AuthContext,
  Form,
  emailRegex,
  t,
  AlertBox,
  SiteAlert,
  RequireLogin,
  AlertTypes,
  passwordRegex,
  DOBField,
  DOBFieldValues,
} from "@bloom-housing/ui-components"
import Link from "next/link"
import FormsLayout from "../../layouts/forms"

type AlertMessage = {
  type: AlertTypes
  message: string
}

const Edit = () => {
  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, errors, watch } = useForm()
  const { profile, userService } = useContext(AuthContext)
  const [passwordAlert, setPasswordAlert] = useState<AlertMessage>()
  const [nameAlert, setNameAlert] = useState<AlertMessage>()
  const [dobAlert, setDobAlert] = useState<AlertMessage>()
  const [phoneNumberAlert, setPhoneNumberAlert] = useState<AlertMessage>()
  const [emailAlert, setEmailAlert] = useState<AlertMessage>()
  const MIN_PASSWORD_LENGTH = 8
  const password = useRef({})
  password.current = watch("password", "")

  const onNameSubmit = async (data: {
    firstName: string
    middleName: string
    lastName: string
  }) => {
    const { firstName, middleName, lastName } = data
    setNameAlert(null)
    try {
      await userService.update({
        body: { ...profile, firstName, middleName, lastName },
      })
      setNameAlert({ type: "success", message: `${t("account.settings.alerts.nameSuccess")}` })
    } catch (err) {
      setNameAlert({ type: "alert", message: `${t("account.settings.alerts.genericError")}` })
      console.warn(err)
    }
  }

  const onBirthdateSubmit = async (data: { dateOfBirth: DOBFieldValues }) => {
    const { dateOfBirth } = data
    setDobAlert(null)
    try {
      await userService.update({
        body: {
          ...profile,
          dob: moment(
            `${dateOfBirth.birthYear}-${dateOfBirth.birthMonth}-${dateOfBirth.birthDay}`
          ).toDate(),
        },
      })
      setDobAlert({ type: "success", message: `${t("account.settings.alerts.dobSuccess")}` })
    } catch (err) {
      setDobAlert({ type: "alert", message: `${t("account.settings.alerts.genericError")}` })
      console.warn(err)
    }
  }

  const onEmailSubmit = async (data: { email: string }) => {
    const { email } = data
    setEmailAlert(null)
    try {
      await userService.update({
        body: { ...profile, email },
      })
      setEmailAlert({ type: "success", message: `${t("account.settings.alerts.emailSuccess")}` })
    } catch (err) {
      setEmailAlert({ type: "alert", message: `${t("account.settings.alerts.genericError")}` })
      console.warn(err)
    }
  }

  const onPhoneNumberSubmit = async (data: { phoneNumber: string }) => {
    const { phoneNumber } = data
    setPhoneNumberAlert(null)
    try {
      await userService.update({
        body: { ...profile, phoneNumber },
      })
      setPhoneNumberAlert({ type: "success", message: `${t("account.settings.alerts.phoneNumberSuccess")}` })
    } catch (err) {
      setPhoneNumberAlert({ type: "alert", message: `${t("account.settings.alerts.genericError")}` })
      console.warn(err)
    }
  }

  const onPasswordSubmit = async (data: {
    password: string
    passwordConfirmation: string
    currentPassword: string
  }) => {
    const { password, passwordConfirmation, currentPassword } = data
    setPasswordAlert(null)
    if (passwordConfirmation === "" || password === "") {
      setPasswordAlert({ type: "alert", message: `${t("account.settings.alerts.passwordEmpty")}` })
      return
    }
    if (passwordConfirmation !== password) {
      setPasswordAlert({ type: "alert", message: `${t("account.settings.alerts.passwordMatch")}` })
      return
    }
    try {
      await userService.update({
        body: { ...profile, password, currentPassword },
      })
      setPasswordAlert({
        type: "success",
        message: `${t("account.settings.alerts.passwordSuccess")}`,
      })
    } catch (err) {
      const { status } = err.response || {}
      if (status === 401) {
        setPasswordAlert({
          type: "alert",
          message: `${t("account.settings.alerts.currentPassword")}`,
        })
      } else {
        setPasswordAlert({ type: "alert", message: `${t("account.settings.alerts.genericError")}` })
      }
      console.warn(err)
    }
  }

  return (
    <RequireLogin signInPath="/sign-in" signInMessage={t("t.loginIsRequired")}>
      <FormsLayout>
        <FormCard>
          <div className="form-card__lead text-center border-b mx-0">
            <Icon size="2xl" symbol="settings" />
            <h2 className="form-card__title">{t("account.accountSettings")}</h2>
          </div>
          <SiteAlert type="notice" dismissable />
          <Form id="update-name" onSubmit={handleSubmit(onNameSubmit)}>
            {nameAlert && (
              <AlertBox type={nameAlert.type} onClose={() => setNameAlert(null)} inverted closeable>
                {nameAlert.message}
              </AlertBox>
            )}
            <div className="form-card__group border-b">
              <label className="field-label--caps" htmlFor="firstName">
                {t("application.name.yourName")}
              </label>

              <Field
                controlClassName="mt-2"
                name="firstName"
                placeholder={`${t("application.name.firstName")}`}
                error={errors.firstName}
                errorMessage={t("errors.firstNameError")}
                register={register}
                defaultValue={profile ? profile.firstName : null}
              />

              <Field
                name="middleName"
                placeholder={`${t("application.name.middleNameOptional")}`}
                register={register}
                defaultValue={profile ? profile?.middleName : null}
              />

              <Field
                name="lastName"
                placeholder={`${t("application.name.lastName")}`}
                error={errors.lastName}
                errorMessage={t("errors.lastNameError")}
                register={register}
                defaultValue={profile ? profile.lastName : null}
              />
              <div className="text-center">
                <Button className="items-center">{t("account.settings.update")}</Button>
              </div>
            </div>
          </Form>
          <Form id="update-birthdate" onSubmit={handleSubmit(onBirthdateSubmit)}>
            {dobAlert && (
              <AlertBox type={dobAlert.type} onClose={() => setDobAlert(null)} inverted closeable>
                {dobAlert.message}
              </AlertBox>
            )}
            <div className="form-card__group border-b">
              <DOBField
                id="dateOfBirth"
                name="dateOfBirth"
                register={register}
                error={errors?.dateOfBirth}
                watch={watch}
                validateAge18={true}
                errorMessage={t("errors.dateOfBirthErrorAge")}
                defaultDOB={{
                  birthDay: profile ? moment(new Date(profile.dob)).utc().format("DD") : null,
                  birthMonth: profile ? moment(new Date(profile.dob)).utc().format("MM") : null,
                  birthYear: profile ? moment(new Date(profile.dob)).utc().format("YYYY") : null,
                }}
                label={t("application.name.yourDateOfBirth")}
              />
              <div className="text-center mt-5">
                <Button className="items-center">{t("account.settings.update")}</Button>
              </div>
            </div>
          </Form>
          <Form id="update-email" onSubmit={handleSubmit(onEmailSubmit)}>
            {emailAlert && (
              <AlertBox
                type={emailAlert.type}
                onClose={() => setEmailAlert(null)}
                inverted
                closeable
              >
                {emailAlert.message}
              </AlertBox>
            )}
            <div className="form-card__group border-b">
              <Field
                caps={true}
                type="email"
                name="email"
                label={`${t("t.email")}`}
                placeholder="example@web.com"
                validation={{ pattern: emailRegex }}
                error={errors.email}
                errorMessage={`${t("errors.emailAddressError")}`}
                register={register}
                defaultValue={profile ? profile.email : null}
              />
              <div className="text-center">
                <Button className={"items-center"}>{t("account.settings.update")}</Button>
              </div>
            </div>
          </Form>
          <Form id="update-phone-number" onSubmit={handleSubmit(onPhoneNumberSubmit)}>
            {phoneNumberAlert && (
              <AlertBox
                type={phoneNumberAlert.type}
                onClose={() => setPhoneNumberAlert(null)}
                inverted
                closeable
              >
                {phoneNumberAlert.message}
              </AlertBox>
            )}
            <div className="form-card__group border-b">
              <Field
                caps={true}
                type="phoneNumber"
                name="phoneNumber"
                label={`${t("t.phone")}`}
                placeholder={`${t("t.phoneNumberPlaceholder")}`}
                // validation={{ pattern: emailRegex }}
                // error={errors.email}
                errorMessage={`${t("errors.phoneNumberError")}`}
                register={register}
                defaultValue={profile ? profile.phoneNumber : null}
              />
              <div className="text-center">
                <Button className={"items-center"}>{t("account.settings.update")}</Button>
              </div>
            </div>
          </Form>
          <Form id="update-password" onSubmit={handleSubmit(onPasswordSubmit)}>
            {passwordAlert && (
              <AlertBox
                type={passwordAlert.type}
                onClose={() => setPasswordAlert(null)}
                inverted
                closeable
              >
                {passwordAlert.message}
              </AlertBox>
            )}
            <div className="form-card__group border-b">
              <fieldset>
                <legend className="field-label--caps">
                  {t("authentication.createAccount.password")}
                </legend>
                <p className="field-note mb-4">{t("account.settings.passwordRemember")}</p>
                <div className={"flex flex-col"}>
                  <Field
                    caps={true}
                    type="password"
                    name="currentPassword"
                    label={t("account.settings.currentPassword")}
                    readerOnly={true}
                    placeholder="Current password"
                    error={errors.currentPassword}
                    register={register}
                    className={"mb-1"}
                  />
                  <div className="float-left text-tiny font-semibold">
                    <Link href="/forgot-password">
                      <a>{t("authentication.signIn.forgotPassword")}</a>
                    </Link>
                  </div>
                </div>

                <div className="mt-5">
                  <Field
                    type="password"
                    name="password"
                    label={t("account.settings.newPassword")}
                    note={t("authentication.createAccount.passwordInfo")}
                    placeholder={t("authentication.createAccount.mustBe8Chars")}
                    validation={{
                      minLength: MIN_PASSWORD_LENGTH,
                      pattern: passwordRegex,
                    }}
                    error={errors.password}
                    errorMessage={t("authentication.signIn.passwordError")}
                    register={register}
                    className={"mb-1"}
                  />
                </div>

                <div className="mt-5">
                  <Field
                    type="password"
                    name="passwordConfirmation"
                    label={t("account.settings.confirmNewPassword")}
                    placeholder={t("authentication.createAccount.mustBe8Chars")}
                    validation={{
                      validate: (value) =>
                        value === password.current ||
                        t("authentication.createAccount.errors.passwordMismatch"),
                    }}
                    error={errors.passwordConfirmation}
                    errorMessage={t("authentication.createAccount.errors.passwordMismatch")}
                    register={register}
                    className={"mb-1"}
                  />
                </div>

                <div className="text-center mt-5">
                  <Button className={"items-center"}>{t("account.settings.update")}</Button>
                </div>
              </fieldset>
            </div>
          </Form>
        </FormCard>
      </FormsLayout>
    </RequireLogin>
  )
}

export default Edit
