import React, { useEffect, useContext, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import {
  AppearanceStyleType,
  Button,
  Field,
  FormCard,
  Icon,
  LinkButton,
  Form,
  emailRegex,
  t,
  DOBField,
  AlertBox,
  Modal,
  passwordRegex,
  AppearanceSizeType,
} from "@bloom-housing/ui-components"
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
dayjs.extend(customParseFormat)
import { useRouter } from "next/router"
import { PageView, pushGtmEvent, AuthContext, SiteAlert } from "@bloom-housing/shared-helpers"
import { UserStatus } from "../lib/constants"
import FormsLayout from "../layouts/forms"

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
              controlClassName="mt-2"
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
                  value === email.current || t("authentication.createAccount.errors.emailMismatch"),
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
              <Button type="submit" styleType={AppearanceStyleType.primary}>
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
            styleType={AppearanceStyleType.primary}
            onClick={() => {
              void router.push("/")
              window.scrollTo(0, 0)
            }}
            size={AppearanceSizeType.small}
          >
            {t("t.ok")}
          </Button>,
          <Button
            disabled={confirmationResent}
            onClick={() => {
              setConfirmationResent(true)
              void resendConfirmation(email.current.toString())
            }}
            size={AppearanceSizeType.small}
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
