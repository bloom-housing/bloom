import React, { useContext, useEffect, useState, useRef } from "react"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)
import customParseFormat from "dayjs/plugin/customParseFormat"
dayjs.extend(customParseFormat)
import { useForm } from "react-hook-form"
import {
  Field,
  Form,
  t,
  AlertBox,
  AlertTypes,
  DOBField,
  DOBFieldValues,
  LoadingOverlay,
} from "@bloom-housing/ui-components"
import { Button, Card } from "@bloom-housing/ui-seeds"
import Link from "next/link"
import {
  PageView,
  pushGtmEvent,
  AuthContext,
  RequireLogin,
  BloomCard,
  passwordRegex,
  emailRegex,
} from "@bloom-housing/shared-helpers"
import { UserStatus } from "../../lib/constants"
import FormsLayout from "../../layouts/forms"

import styles from "./account.module.scss"

type AlertMessage = {
  type: AlertTypes
  message: string
}

const Edit = () => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const {
    register: nameRegister,
    formState: { errors: nameErrors },
    handleSubmit: nameHandleSubmit,
  } = useForm()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const {
    register: dobRegister,
    formState: { errors: dobErrors },
    handleSubmit: dobHandleSubmit,
    watch: dobWatch,
  } = useForm()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const {
    register: emailRegister,
    formState: { errors: emailErrors },
    handleSubmit: emailHandleSubmit,
  } = useForm()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const {
    register: pwdRegister,
    formState: { errors: pwdErrors },
    handleSubmit: pwdHandleSubmit,
    watch: pwdWatch,
  } = useForm()

  const { profile, userService } = useContext(AuthContext)
  const [passwordAlert, setPasswordAlert] = useState<AlertMessage>()
  const [nameAlert, setNameAlert] = useState<AlertMessage>()
  const [dobAlert, setDobAlert] = useState<AlertMessage>()
  const [emailAlert, setEmailAlert] = useState<AlertMessage>()
  const [nameLoading, setNameLoading] = useState(false)
  const [birthdateLoading, setBirthdateLoading] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const MIN_PASSWORD_LENGTH = 12
  const password = useRef({})
  password.current = pwdWatch("password", "")

  useEffect(() => {
    if (profile) {
      pushGtmEvent<PageView>({
        event: "pageView",
        pageTitle: "Account Settings",
        status: UserStatus.LoggedIn,
      })
      const getUser = async () => {
        const user = await userService.retrieve({ id: profile.id }).catch((err) => {
          console.error(`Error fetching user`)
          throw err
        })
        setUser(user)
        setLoading(false)
      }
      void getUser()
    }
  }, [profile, userService])

  const onNameSubmit = async (data: {
    firstName: string
    middleName: string
    lastName: string
  }) => {
    setNameLoading(true)
    const { firstName, middleName, lastName } = data
    setNameAlert(null)
    try {
      const newUser = await userService.update({
        body: { ...user, firstName, middleName, lastName },
      })
      setUser(newUser)
      setNameAlert({ type: "success", message: `${t("account.settings.alerts.nameSuccess")}` })
      setNameLoading(false)
    } catch (err) {
      setNameLoading(false)
      setNameAlert({ type: "alert", message: `${t("account.settings.alerts.genericError")}` })
      console.warn(err)
    }
  }

  const onBirthdateSubmit = async (data: { dateOfBirth: DOBFieldValues }) => {
    setBirthdateLoading(true)
    const { dateOfBirth } = data
    setDobAlert(null)
    try {
      const newUser = await userService.update({
        body: {
          ...user,
          dob: dayjs(
            `${dateOfBirth.birthYear}-${dateOfBirth.birthMonth}-${dateOfBirth.birthDay}`
          ).toDate(),
        },
      })
      setUser(newUser)
      setDobAlert({ type: "success", message: `${t("account.settings.alerts.dobSuccess")}` })
      setBirthdateLoading(false)
    } catch (err) {
      setBirthdateLoading(false)
      setDobAlert({ type: "alert", message: `${t("account.settings.alerts.genericError")}` })
      console.warn(err)
    }
  }

  const onEmailSubmit = async (data: { email: string }) => {
    setEmailLoading(true)
    const { email } = data
    setEmailAlert(null)
    try {
      const newUser = await userService.update({
        body: {
          ...user,
          appUrl: window.location.origin,
          newEmail: email,
        },
      })
      setUser(newUser)
      setEmailAlert({ type: "success", message: `${t("account.settings.alerts.emailSuccess")}` })
      setEmailLoading(false)
    } catch (err) {
      setEmailLoading(false)
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
    setPasswordLoading(true)
    const { password, passwordConfirmation, currentPassword } = data
    setPasswordAlert(null)
    if (passwordConfirmation === "" || password === "") {
      setPasswordAlert({ type: "alert", message: `${t("account.settings.alerts.passwordEmpty")}` })
      setPasswordLoading(false)
      return
    }
    if (passwordConfirmation !== password) {
      setPasswordAlert({ type: "alert", message: `${t("account.settings.alerts.passwordMatch")}` })
      setPasswordLoading(false)
      return
    }
    try {
      const newUser = await userService.update({
        body: { ...user, password, currentPassword },
      })
      setUser(newUser)
      setPasswordAlert({
        type: "success",
        message: `${t("account.settings.alerts.passwordSuccess")}`,
      })
      setPasswordLoading(false)
    } catch (err) {
      setPasswordLoading(false)
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
          customIcon="profile"
          title={t("account.accountSettings")}
          subtitle={t("account.accountSettingsSubtitle")}
          headingPriority={1}
        >
          <LoadingOverlay isLoading={loading}>
            <>
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
                <Form id="update-name" onSubmit={nameHandleSubmit(onNameSubmit)}>
                  <label className={styles["account-settings-label"]} htmlFor="firstName">
                    {t("application.name.yourName")}
                  </label>
                  <Field
                    label={t("application.contact.givenName")}
                    className="my-3"
                    controlClassName="mt-2"
                    name="firstName"
                    error={nameErrors.firstName}
                    validation={{ maxLength: 64 }}
                    errorMessage={
                      nameErrors.firstName?.type === "maxLength"
                        ? t("errors.maxLength", { length: 64 })
                        : t("errors.firstNameError")
                    }
                    register={nameRegister}
                    defaultValue={user ? user.firstName : null}
                    dataTestId={"account-first-name"}
                  />

                  <Field
                    name="middleName"
                    className="mb-3"
                    register={nameRegister}
                    defaultValue={user ? user?.middleName : null}
                    label={t("application.name.middleNameOptional")}
                    error={nameErrors.middleName}
                    validation={{ maxLength: 64 }}
                    errorMessage={t("errors.maxLength", { length: 64 })}
                    dataTestId={"account-middle-name"}
                  />

                  <Field
                    name="lastName"
                    placeholder={t("application.name.lastName")}
                    className="mb-6"
                    error={nameErrors.lastName}
                    register={nameRegister}
                    defaultValue={user ? user.lastName : null}
                    label={t("application.contact.familyName")}
                    validation={{ maxLength: 64 }}
                    errorMessage={
                      nameErrors.lastName?.type === "maxLength"
                        ? t("errors.maxLength", { length: 64 })
                        : t("errors.lastNameError")
                    }
                    dataTestId={"account-last-name"}
                  />
                  <Button
                    type="submit"
                    size="sm"
                    variant="primary-outlined"
                    loadingMessage={nameLoading ? t("t.loading") : undefined}
                    id={"account-submit-name"}
                  >
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
                <Form id="update-birthdate" onSubmit={dobHandleSubmit(onBirthdateSubmit)}>
                  <DOBField
                    id="dateOfBirth"
                    name="dateOfBirth"
                    register={dobRegister}
                    error={dobErrors?.dateOfBirth}
                    watch={dobWatch}
                    validateAge18={true}
                    required={true}
                    errorMessage={t("errors.dateOfBirthErrorAge")}
                    defaultDOB={{
                      birthDay: user ? dayjs(new Date(user.dob)).utc().format("DD") : null,
                      birthMonth: user ? dayjs(new Date(user.dob)).utc().format("MM") : null,
                      birthYear: user ? dayjs(new Date(user.dob)).utc().format("YYYY") : null,
                    }}
                    label={t("application.name.yourDateOfBirth")}
                  />
                  <p className={"field-sub-note"}>{t("application.name.dobHelper")}</p>
                  <Button
                    type="submit"
                    size="sm"
                    variant="primary-outlined"
                    className="mt-6"
                    loadingMessage={birthdateLoading ? t("t.loading") : undefined}
                    id={"account-submit-dob"}
                  >
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
                <Form id="update-email" onSubmit={emailHandleSubmit(onEmailSubmit)}>
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
                    error={emailErrors.email}
                    errorMessage={`${t("errors.emailAddressError")}`}
                    register={emailRegister}
                    defaultValue={user ? user.email : null}
                    dataTestId={"account-email"}
                  />
                  <Button
                    type="submit"
                    size="sm"
                    variant="primary-outlined"
                    loadingMessage={emailLoading ? t("t.loading") : undefined}
                    id={"account-submit-email"}
                  >
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
                <Form id="update-password" onSubmit={pwdHandleSubmit(onPasswordSubmit)}>
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
                        error={pwdErrors.currentPassword}
                        register={pwdRegister}
                        className={"mb-1"}
                        dataTestId={"account-current-password"}
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
                      error={pwdErrors.password}
                      errorMessage={t("authentication.signIn.passwordError")}
                      register={pwdRegister}
                      dataTestId={"account-password"}
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
                      error={pwdErrors.passwordConfirmation}
                      errorMessage={t("authentication.createAccount.errors.passwordMismatch")}
                      register={pwdRegister}
                      dataTestId={"account-password-confirmation"}
                    />

                    <Button
                      type="submit"
                      size="sm"
                      variant="primary-outlined"
                      loadingMessage={passwordLoading ? t("t.loading") : undefined}
                      id={"account-submit-password"}
                    >
                      {t("account.settings.update")}
                    </Button>
                  </fieldset>
                </Form>
              </Card.Section>
              <Card.Section divider="inset" className={styles["account-card-settings-section"]}>
                <p className={styles["account-settings-disclaimer"]}>
                  {t("account.settings.dataRemovalDisclaimer")}
                </p>
              </Card.Section>
            </>
          </LoadingOverlay>
        </BloomCard>
      </FormsLayout>
    </RequireLogin>
  )
}

export default Edit
