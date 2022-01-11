import React, { useState, useContext, useRef } from "react"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import {
  AppearanceStyleType,
  Button,
  Field,
  Form,
  FormCard,
  Icon,
  AuthContext,
  t,
  AlertBox,
  SiteAlert,
  passwordRegex,
  setSiteAlertMessage,
} from "@bloom-housing/ui-components"
import FormsLayout from "../layouts/forms"

/**
 * This page is used for updating passwords after a defined amount of time.
 */
const UpdatePassword = () => {
  const router = useRouter()

  const { resetPassword } = useContext(AuthContext)

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, watch, errors } = useForm()
  const password = useRef({})
  password.current = watch("password", "")

  const [requestError, setRequestError] = useState<string>()

  const onSubmit = async (data: { password: string; passwordConfirmation: string }) => {
    // const { password, passwordConfirmation } = data
    // try {
    //   const user = await resetPassword(token.toString(), password, passwordConfirmation)
    //   setSiteAlertMessage(t(`authentication.signIn.success`, { name: user.firstName }), "success")
    //   await router.push("/")
    //   window.scrollTo(0, 0)
    // } catch (err) {
    //   const { status, data } = err.response || {}
    //   if (status === 400) {
    //     setRequestError(`${t(`authentication.forgotPassword.errors.${data.message}`)}`)
    //   } else {
    //     console.error(err)
    //     setRequestError(`${t("authentication.forgotPassword.errors.generic")}`)
    //   }
    // }
  }

  return (
    <FormsLayout>
      <FormCard>
        <div className="form-card__lead text-center border-b mx-0">
          <Icon size="2xl" symbol="profile" />
          <h2 className="form-card__title">{t("account.settings.resetYourPassword")}</h2>
          <p className="mt-4 md:px-12 field-note">{t("account.settings.needUpdatePassword")}</p>
        </div>

        {requestError && (
          <AlertBox className="" onClose={() => setRequestError(undefined)} type="alert">
            {requestError}
          </AlertBox>
        )}

        <SiteAlert type="notice" dismissable />

        <div className="form-card__group pt-0 border-b">
          <Form id="update-password" className="mt-10" onSubmit={handleSubmit(onSubmit)}>
            <legend className="field-label--caps">
              {t("authentication.createAccount.password")}
            </legend>
            <p className="field-note mb-4">{t("users.makeNote")}</p>

            <Field
              caps={false}
              name="password"
              label={t("account.settings.newPassword")}
              validation={{
                required: true,
                minLength: 8,
                pattern: passwordRegex,
              }}
              error={errors.password}
              errorMessage={t("errors.enterNewLoginPassword")}
              register={register}
              type="password"
              subNote={t("authentication.createAccount.passwordInfo")}
            />
            <Field
              caps={false}
              name="passwordConfirmation"
              label={t("account.settings.confirmNewPassword")}
              validation={{
                validate: (value) =>
                  value === password.current || t("errors.passwordConfirmationMismatch"),
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
              error={errors.password}
              errorMessage={t("errors.passwordConfirmationMismatch")}
              register={register}
              type="password"
            />

            <div className="text-center mt-6">
              <Button styleType={AppearanceStyleType.primary}>
                {t("account.settings.updatePassword")}
              </Button>
            </div>
          </Form>
        </div>
      </FormCard>
    </FormsLayout>
  )
}

export { UpdatePassword as default, UpdatePassword }
