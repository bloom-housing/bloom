import React, { useEffect, useContext, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import {
  Field,
  FormCard,
  Icon,
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
import { CardSection, CardFooter } from "@bloom-housing/ui-seeds/src/blocks/Card"
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
dayjs.extend(customParseFormat)
import { useRouter } from "next/router"
import { PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import { UserStatus } from "../lib/constants"
import FormsLayout from "../layouts/forms"
import { AccountCard } from "../components/account/AccountCard"
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
      {process.env.showMandatedAccounts ? (
        <>
          <AccountCard
            iconSymbol="profile"
            title={t("account.createAccount.title")}
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
                <CardSection divider={"inset"} className="space-y-3 mx-12 p-0 py-8">
                  <label className={styles["create-account-header"]} htmlFor="firstName">
                    {t("application.name.yourNameLowercase")}
                  </label>

                  <label className={styles["create-account-field"]} htmlFor="givenName">
                    {t("application.name.givenName")}
                  </label>
                  <Field
                    controlClassName={styles["create-account-input"]}
                    name="givenName"
                    validation={{ required: true, maxLength: 64 }}
                    error={errors.givenName}
                    errorMessage={
                      errors.givenName?.type === "maxLength"
                        ? t("errors.maxLength")
                        : t("errors.givenNameError")
                    }
                    register={register}
                  />

                  <label className={styles["create-account-field"]} htmlFor="middleName">
                    {t("application.name.middleNameOptionalLowercase")}
                  </label>
                  <Field
                    name="middleName"
                    register={register}
                    label={t("application.name.middleNameOptionalLowercase")}
                    readerOnly
                    error={errors.middleName}
                    validation={{ maxLength: 64 }}
                    errorMessage={t("errors.maxLength")}
                    controlClassName={styles["create-account-input"]}
                  />

                  <label className={styles["create-account-field"]} htmlFor="familyName">
                    {t("application.name.familyName")}
                  </label>
                  <Field
                    name="familyName"
                    validation={{ required: true, maxLength: 64 }}
                    error={errors.familyName}
                    register={register}
                    label={t("application.name.familyName")}
                    errorMessage={
                      errors.familyName?.type === "maxLength"
                        ? t("errors.maxLength")
                        : t("errors.familyNameError")
                    }
                    readerOnly
                    controlClassName={styles["create-account-input"]}
                  />
                </CardSection>
                <CardSection divider={"inset"} className="mx-12 p-0 py-8">
                  <DOBField
                    register={register}
                    required={true}
                    error={errors.dob}
                    name="dob"
                    id="dob"
                    watch={watch}
                    validateAge18={true}
                    errorMessage={t("errors.dateOfBirthErrorAge")}
                    label={t("application.name.yourDateOfBirthLowercase")}
                  />
                  <p className={"field-sub-note"}>{t("application.name.yourDateOfBirthExample")}</p>
                </CardSection>

                <CardSection divider={"inset"} className="mx-12 p-0 py-8">
                  <Field
                    caps={true}
                    type="email"
                    name="email"
                    label={t("application.name.yourEmailAddressLowercase")}
                    validation={{ required: true, pattern: emailRegex }}
                    error={errors.email}
                    errorMessage={t("authentication.signIn.loginError")}
                    register={register}
                    controlClassName={styles["create-account-input"]}
                  />
                </CardSection>
                <CardSection className="mx-12 p-0 py-8 space-y-3">
                  <Field
                    caps={true}
                    type={"password"}
                    name="password"
                    note={t("authentication.createAccount.passwordInfo")}
                    label={t("authentication.createAccount.passwordCreate")}
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
                    {t("account.createAccount.label")}
                  </Button>
                </CardSection>
              </Form>
              <CardFooter className="border-t mx-12 m-0 py-8">
                <Heading size="2xl" className="mb-6 font-semibold">
                  {t("account.haveAnAccount")}
                </Heading>
                <Button href="/sign-in" variant="primary-outlined">
                  {t("nav.signIn")}
                </Button>
              </CardFooter>
            </>
          </AccountCard>
        </>
      ) : (
        <FormCard>
          <div className="form-card__lead text-center border-b mx-0">
            <Icon size="2xl" symbol="profile" />
            <h1 className="form-card__title">{t("account.createAccount")}</h1>
            {requestError && (
              <AlertBox className="" onClose={() => setRequestError(undefined)} type="alert">
                {requestError}
              </AlertBox>
            )}
            <SiteAlert type="notice" dismissable />
          </div>
          <Form id="create-account" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-card__group border-b">
              <label className="text__caps-spaced" htmlFor="firstName">
                {t("application.name.yourName")}
              </label>

              <Field
                controlClassName={styles["account-creation-input"]}
                name="firstName"
                placeholder={t("application.name.firstName")}
                validation={{ required: true, maxLength: 64 }}
                error={errors.firstName}
                errorMessage={
                  errors.firstName?.type === "maxLength"
                    ? t("errors.maxLength")
                    : t("errors.firstNameError")
                }
                register={register}
              />

              <Field
                name="middleName"
                placeholder={t("application.name.middleNameOptional")}
                register={register}
                label={t("application.name.middleNameOptional")}
                readerOnly
                error={errors.middleName}
                validation={{ maxLength: 64 }}
                errorMessage={t("errors.maxLength")}
              />

              <Field
                name="lastName"
                placeholder={t("application.name.lastName")}
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
                validateAge18={true}
                errorMessage={t("errors.dateOfBirthErrorAge")}
                label={t("application.name.yourDateOfBirth")}
              />
            </div>

            <div className="form-card__group border-b">
              <Field
                caps={true}
                type="email"
                name="email"
                label={t("t.email")}
                placeholder="example@web.com"
                validation={{ required: true, pattern: emailRegex }}
                error={errors.email}
                errorMessage={t("authentication.signIn.loginError")}
                register={register}
              />
              <p className="text text-gray-750 text-sm pb-2">
                {t("authentication.createAccount.reEnterEmail")}
              </p>
              <Field
                type="email"
                name="emailConfirmation"
                placeholder="example@web.com"
                validation={{
                  validate: (value) =>
                    value === email.current ||
                    t("authentication.createAccount.errors.emailMismatch"),
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
                error={errors.emailConfirmation}
                errorMessage={t("authentication.createAccount.errors.emailMismatch")}
                register={register}
                label={t("authentication.createAccount.reEnterEmail")}
                readerOnly
              />
            </div>

            <div className="form-card__group border-b">
              <Field
                caps={true}
                type="password"
                name="password"
                note={t("authentication.createAccount.passwordInfo")}
                label={t("authentication.createAccount.password")}
                placeholder={t("authentication.createAccount.mustBe8Chars")}
                validation={{
                  required: true,
                  minLength: 8,
                  pattern: passwordRegex,
                }}
                error={errors.password}
                errorMessage={t("authentication.signIn.passwordError")}
                register={register}
              />
              <p className="text text-gray-750 text-sm pb-2">
                {t("authentication.createAccount.reEnterPassword")}
              </p>
              <Field
                type="password"
                name="passwordConfirmation"
                placeholder={t("authentication.createAccount.mustBe8Chars")}
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
                label={t("authentication.createAccount.reEnterPassword")}
                readerOnly
              />

              <div className="text-center mt-10">
                <Button type="submit" variant="primary">
                  {t("account.createAccount")}
                </Button>
              </div>
            </div>
          </Form>

          <div className="form-card__group text-center">
            <h2 className="mb-6">{t("account.haveAnAccount")}</h2>

            <Button variant="primary-outlined" href="/sign-in">
              {t("nav.signIn")}
            </Button>
          </div>
        </FormCard>
      )}
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
