import React, { useEffect, useContext, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import {
  Field,
  Form,
  emailRegex,
  t,
  DOBField,
  AlertBox,
  SiteAlert,
  Modal,
  passwordRegex,
} from "@bloom-housing/ui-components"
import { Button, Heading } from "@bloom-housing/ui-seeds"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
dayjs.extend(customParseFormat)
import { useRouter } from "next/router"
import { PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import { UserStatus } from "../lib/constants"
import FormsLayout from "../layouts/forms"
import { AccountCard } from "../components/account/AccountCard"
import accountCardStyles from "./account/account.module.scss"
import styles from "../../styles/create-account.module.scss"

export default () => {
  const { createUser, resendConfirmation } = useContext(AuthContext)
  const [confirmationResent, setConfirmationResent] = useState<boolean>(false)
  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, errors, watch } = useForm()
  const [requestError, setRequestError] = useState<string>()
  const [openModal, setOpenModal] = useState<boolean>(false)
  const router = useRouter()
  const language = router.locale
  const email = useRef({})
  const password = useRef({})
  email.current = watch("email", "")
  password.current = watch("password", "")

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Create Account",
      status: UserStatus.NotLoggedIn,
    })
  }, [])

  const onSubmit = async (data) => {
    try {
      const { dob, ...rest } = data
      await createUser({
        ...rest,
        dob: dayjs(`${dob.birthYear}-${dob.birthMonth}-${dob.birthDay}`),
        language,
      })

      setOpenModal(true)
    } catch (err) {
      const { status, data } = err.response || {}
      if (status === 400) {
        setRequestError(`${t(`authentication.createAccount.errors.${data.message}`)}`)
      } else if (status === 409) {
        console.error(err)
        setRequestError(`${t("authentication.createAccount.errors.emailInUse")}`)
      } else {
        console.error(err)
        setRequestError(`${t("authentication.createAccount.errors.generic")}`)
      }
      window.scrollTo(0, 0)
    }
  }

  return (
    <FormsLayout>
      <AccountCard
        iconSymbol="profile"
        title={t("account.createAccount")}
        divider="inset"
        headingPriority={1}
      >
        <>
          {requestError && (
            <AlertBox className="" onClose={() => setRequestError(undefined)} type="alert">
              {requestError}
            </AlertBox>
          )}
          <SiteAlert type="notice" dismissable />
          <Form id="create-account" onSubmit={handleSubmit(onSubmit)}>
            <CardSection divider={"inset"} className={accountCardStyles["account-card-section"]}>
              <label className={styles["create-account-header"]} htmlFor="firstName">
                {t("application.name.yourName")}
              </label>

              <label className={styles["create-account-field"]} htmlFor="firstName">
                {t("application.name.firstName")}
              </label>
              <Field
                controlClassName={styles["create-account-input"]}
                name="firstName"
                validation={{ required: true, maxLength: 64 }}
                error={errors.givenName}
                errorMessage={
                  errors.givenName?.type === "maxLength"
                    ? t("errors.maxLength")
                    : t("errors.firstNameError")
                }
                register={register}
              />

              <label className={styles["create-account-field"]} htmlFor="middleName">
                {t("application.name.middleNameOptional")}
              </label>
              <Field
                name="middleName"
                register={register}
                label={t("application.name.middleNameOptional")}
                readerOnly
                error={errors.middleName}
                validation={{ maxLength: 64 }}
                errorMessage={t("errors.maxLength")}
                controlClassName={styles["create-account-input"]}
              />

              <label className={styles["create-account-field"]} htmlFor="lastName">
                {t("application.name.lastName")}
              </label>
              <Field
                name="lastName"
                validation={{ required: true, maxLength: 64 }}
                error={errors.lastName}
                register={register}
                label={t("application.name.lastName")}
                errorMessage={
                  errors.lastName?.type === "maxLength"
                    ? t("errors.maxLength")
                    : t("errors.lastNameError")
                }
                readerOnly
                controlClassName={styles["create-account-input"]}
              />
            </CardSection>
            <CardSection divider={"inset"} className={accountCardStyles["account-card-section"]}>
              <DOBField
                register={register}
                required={true}
                error={errors.dob}
                name="dob"
                id="dob"
                watch={watch}
                validateAge18={true}
                errorMessage={t("errors.dateOfBirthErrorAge")}
                label={t("application.name.yourDateOfBirth")}
              />
              <p className={"field-sub-note"}>{t("application.name.dobHelper")}</p>
            </CardSection>

            <CardSection divider={"inset"} className={accountCardStyles["account-card-section"]}>
              <Field
                caps={true}
                type="email"
                name="email"
                label={t("application.name.yourEmailAddress")}
                validation={{ required: true, pattern: emailRegex }}
                error={errors.email}
                errorMessage={t("authentication.signIn.loginError")}
                register={register}
                controlClassName={styles["create-account-input"]}
              />
            </CardSection>
            <CardSection divider={"inset"} className={accountCardStyles["account-card-section"]}>
              <Field
                caps={true}
                type={"password"}
                name="password"
                note={t("authentication.createAccount.passwordInfo")}
                label={t("authentication.createAccount.password")}
                validation={{
                  required: true,
                  minLength: 8,
                  pattern: passwordRegex,
                }}
                error={errors.password}
                errorMessage={t("authentication.signIn.passwordError")}
                register={register}
                controlClassName={styles["create-account-input"]}
              />
              <label className={styles["create-account-field"]} htmlFor="passwordConfirmation">
                {t("authentication.createAccount.reEnterPassword")}
              </label>
              <Field
                type="password"
                name="passwordConfirmation"
                validation={{
                  validate: (value) =>
                    value === password.current ||
                    t("authentication.createAccount.errors.passwordMismatch"),
                }}
                onPaste={(e) => {
                  e.preventDefault()
                  e.nativeEvent.stopImmediatePropagation()
                  return false
                }}
                onDrop={(e) => {
                  e.preventDefault()
                  e.nativeEvent.stopImmediatePropagation()
                  return false
                }}
                error={errors.passwordConfirmation}
                errorMessage={t("authentication.createAccount.errors.passwordMismatch")}
                register={register}
                controlClassName={styles["create-account-input"]}
                label={t("authentication.createAccount.reEnterPassword")}
                readerOnly
              />
              <Button type="submit" variant="primary">
                {t("account.createAccount")}
              </Button>
            </CardSection>
          </Form>
          <CardSection divider={"inset"} className={accountCardStyles["account-card-section"]}>
            <Heading priority={2} size="2xl" className="mb-6">
              {t("account.haveAnAccount")}
            </Heading>
            <Button href="/sign-in" variant="primary-outlined">
              {t("nav.signIn")}
            </Button>
          </CardSection>
        </>
      </AccountCard>
      <Modal
        open={openModal}
        title={t("authentication.createAccount.confirmationNeeded")}
        ariaDescription={t("authentication.createAccount.anEmailHasBeenSent", {
          email: email.current,
        })}
        onClose={() => {
          void router.push("/")
          window.scrollTo(0, 0)
        }}
        actions={[
          <Button
            variant="primary"
            onClick={() => {
              void router.push("/")
              window.scrollTo(0, 0)
            }}
            size="sm"
          >
            {t("t.ok")}
          </Button>,
          <Button
            variant="primary-outlined"
            disabled={confirmationResent}
            onClick={() => {
              setConfirmationResent(true)
              void resendConfirmation(email.current.toString())
            }}
            size="sm"
          >
            {t("authentication.createAccount.resendTheEmail")}
          </Button>,
        ]}
      >
        <>
          <p>{t("authentication.createAccount.anEmailHasBeenSent", { email: email.current })}</p>
          <p>{t("authentication.createAccount.confirmationInstruction")}</p>
        </>
      </Modal>
    </FormsLayout>
  )
}
