import React, { useState, useContext, useRef } from "react"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import { Button } from "@bloom-housing/ui-seeds"
import { Field, Form, FormCard, Icon, t, AlertBox, SiteAlert } from "@bloom-housing/ui-components"
import { AuthContext, MessageContext } from "@bloom-housing/shared-helpers"
import FormsLayout from "../layouts/forms"

const ResetPassword = () => {
  const router = useRouter()
  const { token } = router.query
  const { resetPassword } = useContext(AuthContext)
  const { addToast } = useContext(MessageContext)
  /* Form Handler */
  // This is causing a linting issue with unbound-method, see open issue as of 10/21/2020:
  // https://github.com/react-hook-form/react-hook-form/issues/2887
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, errors, watch } = useForm()
  const [requestError, setRequestError] = useState<string>()

  const passwordValue = useRef({})
  passwordValue.current = watch("password", "")

  const onSubmit = async (data: { password: string; passwordConfirmation: string }) => {
    const { password, passwordConfirmation } = data

    try {
      const user = await resetPassword(token.toString(), password, passwordConfirmation)
      await router.push("/")
      window.scrollTo(0, 0)
      // TODO: convert this to an alert https://github.com/bloom-housing/bloom/issues/3433
      addToast(t(`authentication.signIn.success`, { name: user.firstName }), { variant: "success" })
    } catch (err) {
      const { status, data } = err.response || {}
      if (status === 400) {
        setRequestError(`${t(`authentication.forgotPassword.errors.${data.message}`)}`)
      } else {
        console.error(err)
        setRequestError(`${t("account.settings.alerts.genericError")}`)
      }
    }
  }

  return (
    <FormsLayout>
      <FormCard>
        <div className="form-card__lead text-center border-b mx-0">
          <Icon size="2xl" symbol="profile" />
          <h2 className="form-card__title">{t("authentication.forgotPassword.changePassword")}</h2>
        </div>
        {requestError && (
          <AlertBox className="" onClose={() => setRequestError(undefined)} type="alert">
            {requestError}
          </AlertBox>
        )}
        <SiteAlert type="notice" dismissable />
        <div className="form-card__group pt-0 border-b">
          <Form id="sign-in" className="mt-10" onSubmit={handleSubmit(onSubmit)}>
            <Field
              caps={true}
              name="password"
              label={t("authentication.createAccount.password")}
              validation={{ required: true }}
              error={errors.password}
              errorMessage={t("authentication.forgotPassword.enterNewLoginPassword")}
              register={register}
              type="password"
            />
            <Field
              caps={true}
              name="passwordConfirmation"
              label={t("authentication.forgotPassword.passwordConfirmation")}
              validation={{
                validate: (value) =>
                  value === passwordValue.current ||
                  t("authentication.createAccount.errors.passwordMismatch"),
              }}
              error={errors.passwordConfirmation}
              errorMessage={t("authentication.createAccount.errors.passwordMismatch")}
              register={register}
              type="password"
            />

            <div className="text-center mt-6">
              <Button type="submit" variant="primary">
                {t("authentication.forgotPassword.changePassword")}
              </Button>
            </div>
          </Form>
        </div>
      </FormCard>
    </FormsLayout>
  )
}

export { ResetPassword as default, ResetPassword }
