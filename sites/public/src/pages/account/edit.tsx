import React, { useContext, useEffect, useState, useRef } from "react"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)
import customParseFormat from "dayjs/plugin/customParseFormat"
dayjs.extend(customParseFormat)
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import {
  Field,
  Form,
  emailRegex,
  t,
  AlertBox,
  SiteAlert,
  AlertTypes,
  passwordRegex,
  DOBField,
  DOBFieldValues,
} from "@bloom-housing/ui-components"
import { Button, Card } from "@bloom-housing/ui-seeds"
import Link from "next/link"
import {
  PageView,
  pushGtmEvent,
  AuthContext,
  RequireLogin,
  BloomCard,
} from "@bloom-housing/shared-helpers"
import { UserStatus } from "../../lib/constants"
import FormsLayout from "../../layouts/forms"

import styles from "./account.module.scss"

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
  const [emailAlert, setEmailAlert] = useState<AlertMessage>()
  const MIN_PASSWORD_LENGTH = 8
  const password = useRef({})
  const router = useRouter()
  password.current = watch("password", "")

  useEffect(() => {
    if (profile) {
      pushGtmEvent<PageView>({
        event: "pageView",
        pageTitle: "Account Settings",
        status: UserStatus.LoggedIn,
      })
    }
  }, [profile])

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
          dob: dayjs(
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
        body: {
          ...profile,
          appUrl: window.location.origin,
          newEmail: email,
        },
      })
      if (process.env.showPwdless) {
        await router.push({
          pathname: "/verify",
          query: { flowType: "update", email },
        })
      } else {
        setEmailAlert({ type: "success", message: `${t("account.settings.alerts.emailSuccess")}` })
      }
    } catch (err) {
      console.log("err = ", err)
      setEmailAlert({ type: "alert", message: `${t("account.settings.alerts.genericError")}` })
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
        <BloomCard
          iconSymbol="profile"
          title={t("account.accountSettings")}
          subtitle={t("account.accountSettingsSubtitle")}
          headingPriority={1}
        >
          <>
            <SiteAlert type="notice" dismissable />

            <Card.Section divider="inset" className={styles["account-card-settings-section"]}>
              {nameAlert && (
                <AlertBox
                  type={nameAlert.type}
                  onClose={() => setNameAlert(null)}
                  className="mb-4"
                  inverted
                  closeable
                >
                  {nameAlert.message}
                </AlertBox>
              )}
              <Form id="update-name" onSubmit={handleSubmit(onNameSubmit)}>
                <label className={styles["account-settings-label"]} htmlFor="firstName">
                  {t("application.name.yourName")}
                </label>
                <Field
                  label={t("application.contact.givenName")}
                  className="my-3"
                  controlClassName="mt-2"
                  name="firstName"
                  error={errors.firstName}
                  validation={{ maxLength: 64 }}
                  errorMessage={
                    errors.firstName?.type === "maxLength"
                      ? t("errors.maxLength")
                      : t("errors.firstNameError")
                  }
                  register={register}
                  defaultValue={profile ? profile.firstName : null}
                />

                <Field
                  name="middleName"
                  className="mb-3"
                  register={register}
                  defaultValue={profile ? profile?.middleName : null}
                  label={t("application.name.middleNameOptional")}
                  error={errors.middleName}
                  validation={{ maxLength: 64 }}
                  errorMessage={t("errors.maxLength")}
                />

                <Field
                  name="lastName"
                  placeholder={t("application.name.lastName")}
                  className="mb-6"
                  error={errors.lastName}
                  register={register}
                  defaultValue={profile ? profile.lastName : null}
                  label={t("application.contact.familyName")}
                  validation={{ maxLength: 64 }}
                  errorMessage={
                    errors.lastName?.type === "maxLength"
                      ? t("errors.maxLength")
                      : t("errors.lastNameError")
                  }
                />
                <Button type="submit" size="sm" variant="primary-outlined">
                  {t("account.settings.update")}
                </Button>
              </Form>
            </Card.Section>

            <Card.Section divider="inset" className={styles["account-card-settings-section"]}>
              {dobAlert && (
                <AlertBox
                  type={dobAlert.type}
                  onClose={() => setDobAlert(null)}
                  className="mb-4"
                  inverted
                  closeable
                >
                  {dobAlert.message}
                </AlertBox>
              )}
              <Form id="update-birthdate" onSubmit={handleSubmit(onBirthdateSubmit)}>
                <DOBField
                  id="dateOfBirth"
                  name="dateOfBirth"
                  register={register}
                  error={errors?.dateOfBirth}
                  watch={watch}
                  validateAge18={true}
                  required={true}
                  errorMessage={t("errors.dateOfBirthErrorAge")}
                  defaultDOB={{
                    birthDay: profile ? dayjs(new Date(profile.dob)).utc().format("DD") : null,
                    birthMonth: profile ? dayjs(new Date(profile.dob)).utc().format("MM") : null,
                    birthYear: profile ? dayjs(new Date(profile.dob)).utc().format("YYYY") : null,
                  }}
                  label={t("application.name.yourDateOfBirth")}
                />
                <p className={"field-sub-note"}>{t("application.name.dobHelper")}</p>
                <Button type="submit" size="sm" variant="primary-outlined" className="mt-6">
                  {t("account.settings.update")}
                </Button>
              </Form>
            </Card.Section>

            <Card.Section divider="inset" className={styles["account-card-settings-section"]}>
              {emailAlert && (
                <AlertBox
                  type={emailAlert.type}
                  onClose={() => setEmailAlert(null)}
                  inverted
                  closeable
                  className={"mb-4"}
                >
                  {emailAlert.message}
                </AlertBox>
              )}
              <Form id="update-email" onSubmit={handleSubmit(onEmailSubmit)}>
                <label className={styles["account-settings-label"]} htmlFor="email">
                  {t("application.name.yourEmailAddress")}
                </label>
                <Field
                  type="email"
                  name="email"
                  label={`${t("t.email")}`}
                  placeholder="example@web.com"
                  className="mt-3 mb-6"
                  validation={{ pattern: emailRegex }}
                  error={errors.email}
                  errorMessage={`${t("errors.emailAddressError")}`}
                  register={register}
                  defaultValue={profile ? profile.email : null}
                />
                <Button type="submit" size="sm" variant="primary-outlined">
                  {t("account.settings.update")}
                </Button>
              </Form>
            </Card.Section>

            <Card.Section divider="inset" className={styles["account-card-settings-section"]}>
              {passwordAlert && (
                <AlertBox
                  type={passwordAlert.type}
                  onClose={() => setPasswordAlert(null)}
                  className="mb-4"
                  inverted
                  closeable
                >
                  {passwordAlert.message}
                </AlertBox>
              )}
              <Form id="update-password" onSubmit={handleSubmit(onPasswordSubmit)}>
                <fieldset>
                  <legend className={styles["account-settings-label"]}>
                    {t("authentication.createAccount.password")}
                  </legend>
                  <p className="field-note mt-2 mb-3">{t("account.settings.passwordRemember")}</p>
                  <div className={"flex flex-col"}>
                    <Field
                      type="password"
                      name="currentPassword"
                      label={t("account.settings.currentPassword")}
                      error={errors.currentPassword}
                      register={register}
                      className={"mb-1"}
                    />
                    <span className="float-left text-sm font-semibold mt-2">
                      <Link href="/forgot-password">
                        {t("authentication.signIn.forgotPassword")}
                      </Link>
                    </span>
                  </div>

                  <Field
                    type="password"
                    name="password"
                    label={t("account.settings.newPassword")}
                    labelClassName="mt-4"
                    className="mt-4"
                    note={t("authentication.createAccount.passwordInfo")}
                    validation={{
                      minLength: MIN_PASSWORD_LENGTH,
                      pattern: passwordRegex,
                    }}
                    error={errors.password}
                    errorMessage={t("authentication.signIn.passwordError")}
                    register={register}
                  />

                  <Field
                    type="password"
                    name="passwordConfirmation"
                    label={t("account.settings.confirmNewPassword")}
                    className="mt-4 mb-6"
                    validation={{
                      validate: (value) =>
                        value === password.current ||
                        t("authentication.createAccount.errors.passwordMismatch"),
                    }}
                    error={errors.passwordConfirmation}
                    errorMessage={t("authentication.createAccount.errors.passwordMismatch")}
                    register={register}
                  />

                  <Button type="submit" size="sm" variant="primary-outlined">
                    {t("account.settings.update")}
                  </Button>
                </fieldset>
              </Form>
            </Card.Section>
          </>
        </BloomCard>
      </FormsLayout>
    </RequireLogin>
  )
}

export default Edit
