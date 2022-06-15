import React, { useEffect, useState, useContext } from "react"
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
import { PageView, pushGtmEvent } from "@bloom-housing/shared-helpers"
import { UserStatus } from "../lib/constants"
import FormsLayout from "../layouts/forms"

const ResetPassword = () => {
  const router = useRouter()
  const { token } = router.query
  const { resetPassword } = useContext(AuthContext)
  /* Form Handler */
  // This is causing a linting issue with unbound-method, see open issue as of 10/21/2020:
  // https://github.com/react-hook-form/react-hook-form/issues/2887
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, errors } = useForm()
  const [requestError, setRequestError] = useState<string>()

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Reset Password",
      status: UserStatus.NotLoggedIn,
    })
  }, [])

  const onSubmit = async (data: { password: string; passwordConfirmation: string }) => {
    const { password, passwordConfirmation } = data

    try {
      const user = await resetPassword(token.toString(), password, passwordConfirmation)
      setSiteAlertMessage(t(`authentication.signIn.success`, { name: user.firstName }), "success")
      await router.push("/account/dashboard")
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
              label="Password"
              validation={{ required: true }}
              error={errors.password}
              errorMessage="Please enter new login password"
              register={register}
              type="password"
            />
            <Field
              caps={true}
              name="passwordConfirmation"
              label="Password Confirmation"
              validation={{ required: true }}
              error={errors.password}
              errorMessage="Password confirmation does not match"
              register={register}
              type="password"
            />

            <div className="text-center mt-6">
              <Button styleType={AppearanceStyleType.primary}>
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
