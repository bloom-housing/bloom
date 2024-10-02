import React, { useEffect, useContext, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { Field, Form, t, DOBField, AlertBox } from "@bloom-housing/ui-components"
import { Button, Dialog, Heading } from "@bloom-housing/ui-seeds"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
dayjs.extend(customParseFormat)
import { useRouter } from "next/router"
import {
  PageView,
  pushGtmEvent,
  AuthContext,
  BloomCard,
  passwordRegex,
  emailRegex,
} from "@bloom-housing/shared-helpers"
import { UserStatus } from "../lib/constants"
import FormsLayout from "../layouts/forms"
import BloomCardStyles from "./account/account.module.scss"
import accountStyles from "../../styles/create-account.module.scss"
import signUpBenefitsStyles from "../../styles/sign-up-benefits.module.scss"
import SignUpBenefits from "../components/account/SignUpBenefits"
import SignUpBenefitsHeadingGroup from "../components/account/SignUpBenefitsHeadingGroup"
import TermsModal from "../components/shared/TermsModal"
import { LanguagesEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

export default () => {
  const { createUser, resendConfirmation } = useContext(AuthContext)
  const [confirmationResent, setConfirmationResent] = useState<boolean>(false)
  const signUpCopy = process.env.showMandatedAccounts
  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, errors, watch, trigger } = useForm()
  const [requestError, setRequestError] = useState<string>()
  const [openTermsModal, setOpenTermsModal] = useState<boolean>(false)
  const [openEmailModal, setOpenEmailModal] = useState<boolean>(false)
  const [isTermsLoading, setIsTermsLoading] = useState(false)
  const [notChecked, setChecked] = useState(true)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const language = router.locale
  const listingId = router.query?.listingId as string
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
    setChecked(true)
    setLoading(true)
    try {
      setIsTermsLoading(true)
      const { dob, ...rest } = data
      const listingIdRedirect =
        process.env.showMandatedAccounts && listingId ? listingId : undefined
      const createUserObj = {
        ...rest,
        dob: dayjs(`${dob.birthYear}-${dob.birthMonth}-${dob.birthDay}`).toDate(),
        language: language as LanguagesEnum,
      }
      await createUser(createUserObj, listingIdRedirect)
      if (process.env.showPwdless) {
        const redirectUrl = router.query?.redirectUrl as string
        const listingId = router.query?.listingId as string
        let queryParams: { [key: string]: string } = { email: data.email, flowType: "create" }
        if (redirectUrl) queryParams = { ...queryParams, redirectUrl }
        if (listingId) queryParams = { ...queryParams, listingId }

        await router.push({
          pathname: "/verify",
          query: queryParams,
        })
      }
      setOpenEmailModal(true)
      setIsTermsLoading(false)
      setOpenTermsModal(false)
      setLoading(false)
    } catch (err) {
      setLoading(false)
      setIsTermsLoading(false)
      setOpenTermsModal(false)
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
    <FormsLayout className={signUpCopy && "sm:max-w-lg md:max-w-full"}>
      <div className={signUpCopy && signUpBenefitsStyles["benefits-container"]}>
        {signUpCopy && (
          <div className={signUpBenefitsStyles["benefits-display-hide"]}>
            <SignUpBenefitsHeadingGroup mobileView={true} />
          </div>
        )}
        <div className={signUpCopy && signUpBenefitsStyles["benefits-form-container"]}>
          <BloomCard customIcon="profile" title={t("account.createAccount")} headingPriority={1}>
            <>
              {requestError && (
                <AlertBox className="" onClose={() => setRequestError(undefined)} type="alert">
                  {requestError}
                </AlertBox>
              )}
              <Form id="create-account">
                <CardSection
                  divider={"inset"}
                  className={BloomCardStyles["account-card-settings-section"]}
                >
                  <label className={accountStyles["create-account-header"]} htmlFor="firstName">
                    {t("application.name.yourName")}
                  </label>

                  <label className={accountStyles["create-account-field"]} htmlFor="firstName">
                    {t("application.name.firstOrGivenName")}
                  </label>
                  <Field
                    controlClassName={accountStyles["create-account-input"]}
                    name="firstName"
                    validation={{ required: true, maxLength: 64 }}
                    error={errors.givenName}
                    errorMessage={
                      errors.givenName?.type === "maxLength"
                        ? t("errors.maxLength", { length: 64 })
                        : t("errors.firstNameError")
                    }
                    register={register}
                  />

                  <label className={accountStyles["create-account-field"]} htmlFor="middleName">
                    {t("application.name.middleNameOptional")}
                  </label>
                  <Field
                    name="middleName"
                    register={register}
                    error={errors.middleName}
                    validation={{ maxLength: 64 }}
                    errorMessage={t("errors.maxLength", { length: 64 })}
                    controlClassName={accountStyles["create-account-input"]}
                  />

                  <label className={accountStyles["create-account-field"]} htmlFor="lastName">
                    {t("application.name.lastOrFamilyName")}
                  </label>
                  <Field
                    name="lastName"
                    validation={{ required: true, maxLength: 64 }}
                    error={errors.lastName}
                    register={register}
                    errorMessage={
                      errors.lastName?.type === "maxLength"
                        ? t("errors.maxLength", { length: 64 })
                        : t("errors.lastNameError")
                    }
                    controlClassName={accountStyles["create-account-input"]}
                  />
                </CardSection>
                <CardSection
                  divider={"inset"}
                  className={BloomCardStyles["account-card-settings-section"]}
                >
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
                  <p className={`field-note ${accountStyles["create-account-dob-age-helper"]}`}>
                    {t("application.name.dobHelper2")}
                  </p>
                  <p className={`field-note ${accountStyles["create-account-dob-example"]}`}>
                    {t("application.name.dobHelper")}
                  </p>
                </CardSection>

                <CardSection
                  divider={"inset"}
                  className={BloomCardStyles["account-card-settings-section"]}
                >
                  <Field
                    type="email"
                    name="email"
                    label={t("application.name.yourEmailAddress")}
                    validation={{ required: true, pattern: emailRegex }}
                    error={errors.email}
                    errorMessage={t("authentication.signIn.loginError")}
                    register={register}
                    controlClassName={accountStyles["create-account-input"]}
                    labelClassName={"text__caps-spaced"}
                    note={
                      process.env.showPwdless
                        ? t("application.name.yourEmailAddressPwdlessHelper")
                        : null
                    }
                  />
                </CardSection>
                <CardSection
                  divider={"inset"}
                  className={BloomCardStyles["account-card-settings-section"]}
                >
                  <Field
                    labelClassName={"text__caps-spaced"}
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
                    controlClassName={accountStyles["create-account-input"]}
                  />
                  <label
                    className={accountStyles["create-account-field"]}
                    htmlFor="passwordConfirmation"
                  >
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
                    controlClassName={accountStyles["create-account-input"]}
                    label={t("authentication.createAccount.reEnterPassword")}
                    readerOnly
                  />
                  <Button
                    onClick={() => {
                      void trigger().then((res) => res && setOpenTermsModal(true))
                    }}
                    variant="primary"
                    loadingMessage={loading ? t("t.loading") : undefined}
                  >
                    {t("account.createAccount")}
                  </Button>
                </CardSection>
                <CardSection
                  divider={"inset"}
                  className={BloomCardStyles["account-card-settings-section"]}
                >
                  <Heading priority={2} size="2xl" className="mb-6">
                    {t("account.haveAnAccount")}
                  </Heading>
                  <Button href="/sign-in" variant="primary-outlined">
                    {t("nav.signIn")}
                  </Button>
                </CardSection>
                {/* Terms disclaimer modal */}
                <TermsModal
                  control={{ register, errors, handleSubmit }}
                  onSubmit={onSubmit}
                  notChecked={notChecked}
                  setChecked={setChecked}
                  openTermsModal={openTermsModal}
                  setOpenTermsModal={setOpenTermsModal}
                  isTermsLoading={isTermsLoading}
                />
              </Form>
            </>
          </BloomCard>
        </div>
        {signUpCopy && (
          <div className={signUpBenefitsStyles["benefits-hide-display"]}>
            <div className={signUpBenefitsStyles["benefits-desktop-container"]}>
              <SignUpBenefitsHeadingGroup mobileView={false} />
              <SignUpBenefits idTag="desktop" />
            </div>
          </div>
        )}
        {signUpCopy && (
          <div className={signUpBenefitsStyles["benefits-display-hide"]}>
            <SignUpBenefits idTag="mobile" />
          </div>
        )}
      </div>

      {/* Email confirmation modal */}
      <Dialog
        isOpen={openEmailModal}
        onClose={() => {
          void router.push("/sign-in")
          window.scrollTo(0, 0)
        }}
        ariaLabelledBy="create-account-dialog-header"
        ariaDescribedBy="create-account-dialog-content"
      >
        <Dialog.Header id="create-account-dialog-header">
          {t("authentication.createAccount.confirmationNeeded")}
        </Dialog.Header>
        <Dialog.Content id="create-account-dialog-content">
          <p>{t("authentication.createAccount.anEmailHasBeenSent", { email: email.current })}</p>
          <p>{t("authentication.createAccount.confirmationInstruction")}</p>
        </Dialog.Content>
        <Dialog.Footer>
          <Button
            variant="primary"
            onClick={() => {
              void router.push("/sign-in")
              window.scrollTo(0, 0)
            }}
            size="sm"
          >
            {t("t.ok")}
          </Button>
          <Button
            variant="primary-outlined"
            disabled={confirmationResent}
            onClick={() => {
              setConfirmationResent(true)
              void resendConfirmation(email.current.toString(), listingId)
            }}
            size="sm"
          >
            {t("authentication.createAccount.resendTheEmail")}
          </Button>
        </Dialog.Footer>
      </Dialog>
    </FormsLayout>
  )
}
