import React, { useState, useContext, useRef } from "react"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import { Button, Icon } from "@bloom-housing/ui-seeds"
import { Field, Form, FormCard, t, AlertBox } from "@bloom-housing/ui-components"
import { AuthContext, CustomIconMap, MessageContext } from "@bloom-housing/shared-helpers"
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
    <FormsLayout title={`Reset Password - ${t("nav.siteTitlePartners")}`}>
      <FormCard>
        <div className="form-card__lead text-center border-b mx-0">
          <Icon size="2xl">{CustomIconMap.profile}</Icon>
          <h2 className="form-card__title">{t("authentication.forgotPassword.changePassword")}</h2>
        </div>
        {requestError && (
          <AlertBox className="" onClose={() => setRequestError(undefined)} type="alert">
            {requestError}
          </AlertBox>
        )}
        <div className="form-card__group pt-0 border-b">
          <Form id="sign-in" className="mt-10" onSubmit={handleSubmit(onSubmit)}>
            <Field
              name="password"
              label={t("authentication.createAccount.password")}
              validation={{ required: true }}
              error={errors.password}
              errorMessage={t("authentication.forgotPassword.enterNewLoginPassword")}
              register={register}
              type="password"
              labelClassName={"text__caps-spaced"}
            />
            <Field
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
              labelClassName={"text__caps-spaced"}
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
