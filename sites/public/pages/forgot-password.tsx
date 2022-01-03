import React, { useState, useContext } from "react"
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
  setSiteAlertMessage,
} from "@bloom-housing/ui-components"
import { emailRegex } from "../lib/helpers"
import FormsLayout from "../layouts/forms"

const ForgotPassword = () => {
  const router = useRouter()
  const { forgotPassword } = useContext(AuthContext)

  /* Form Handler */
  // This is causing a linting issue with unbound-method, see open issue as of 10/21/2020:
  // https://github.com/react-hook-form/react-hook-form/issues/2887
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, errors } = useForm()
  const [requestError, setRequestError] = useState<string>()

  const onSubmit = async (data: { email: string }) => {
    const { email } = data

    try {
      await forgotPassword(email)
      setSiteAlertMessage(t(`authentication.forgotPassword.success`), "success")
      await router.push("/")
    } catch (err) {
      const { status, data } = err.response || {}
      if (status === 400) {
        setRequestError(`${t(`authentication.forgotPassword.errors.${data.message}`)}`)
      } else {
        console.error(err)
        setRequestError(`${t("authentication.forgotPassword.errors.generic")}`)
      }
    }
  }

  return (
    <FormsLayout>
      <FormCard>
        <div className="form-card__lead text-center border-b mx-0">
          <Icon size="2xl" symbol="profile" />
          <h2 className="form-card__title">{t("authentication.forgotPassword.sendEmail")}</h2>
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
              name="email"
              label={t("t.email")}
              validation={{ required: true, pattern: emailRegex }}
              error={errors.email}
              errorMessage={errors.email ? t("authentication.signIn.loginError") : undefined}
              register={register}
            />

            <div className="text-center mt-6">
              <Button styleType={AppearanceStyleType.primary}>
                {t("authentication.forgotPassword.sendEmail")}
              </Button>
            </div>
            <div className="text-center mt-6">
              <a href="#" onClick={() => router.back()}>
                {t("t.cancel")}
              </a>
            </div>
          </Form>
        </div>
      </FormCard>
    </FormsLayout>
  )
}

export { ForgotPassword as default, ForgotPassword }
