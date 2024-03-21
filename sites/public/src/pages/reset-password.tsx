import React, { useEffect, useState, useContext, useRef } from "react"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import {
  Field,
  Form,
  t,
  AlertBox,
  SiteAlert,
  setSiteAlertMessage,
} from "@bloom-housing/ui-components"
import { Button } from "@bloom-housing/ui-seeds"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
import { PageView, pushGtmEvent, AuthContext, BloomCard } from "@bloom-housing/shared-helpers"
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
  const { register, handleSubmit, errors, watch } = useForm()
  const [requestError, setRequestError] = useState<string>()

  const passwordValue = useRef({})
  passwordValue.current = watch("password", "")

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

      const redirectUrl = "/applications/start/choose-language"
      const listingId = router.query?.listingId as string

      const routerRedirectUrl =
        process.env.showMandatedAccounts && redirectUrl && listingId
          ? `${redirectUrl}?listingId=${listingId}`
          : "/account/applications"

      await router.push(routerRedirectUrl)
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
      <BloomCard title={t("authentication.forgotPassword.changePassword")} customIcon={"profile"}>
        <>
          {requestError && (
            <AlertBox className="mt-6" onClose={() => setRequestError(undefined)} type="alert">
              {requestError}
            </AlertBox>
          )}
          <SiteAlert type="notice" dismissable />
          <CardSection>
            <Form id="sign-in" onSubmit={handleSubmit(onSubmit)}>
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

              <Button type="submit" variant="primary">
                {t("authentication.forgotPassword.changePassword")}
              </Button>
            </Form>
          </CardSection>
        </>
      </BloomCard>
    </FormsLayout>
  )
}

export { ResetPassword as default, ResetPassword }
