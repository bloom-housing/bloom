import React, { useEffect, useState, useContext } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import {
  AppearanceStyleType,
  Button,
  Field,
  Form,
  FormCard,
  Icon,
  LinkButton,
  AuthContext,
  t,
  AlertBox,
  SiteAlert,
  setSiteAlertMessage,
} from "@bloom-housing/ui-components"
import { PageView, pushGtmEvent } from "@bloom-housing/shared-helpers"
import FormsLayout from "../layouts/forms"
import { useRedirectToPrevPage } from "../lib/hooks"
import { UserStatus } from "../lib/constants"

const SignIn = () => {
  const { login } = useContext(AuthContext)
  /* Form Handler */
  // This is causing a linting issue with unbound-method, see open issue as of 10/21/2020:
  // https://github.com/react-hook-form/react-hook-form/issues/2887
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, errors } = useForm()
  const redirectToPage = useRedirectToPrevPage("/account/dashboard")
  const [requestError, setRequestError] = useState<string>()

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Sign In",
      status: UserStatus.NotLoggedIn,
    })
  }, [])

  const onSubmit = async (data: { email: string; password: string }) => {
    const { email, password } = data

    try {
      const user = await login(email, password)
      setSiteAlertMessage(t(`authentication.signIn.success`, { name: user.firstName }), "success")
      await redirectToPage()
    } catch (err) {
      const { status } = err.response || {}
      if (status === 401) {
        setRequestError(`${t("authentication.signIn.error")}: ${err.message}`)
      } else {
        console.error(err)
        setRequestError(
          `${t("authentication.signIn.error")}. ${t("authentication.signIn.errorGenericMessage")}`
        )
      }
    }
  }

  return (
    <FormsLayout>
      <FormCard>
        <div className="form-card__lead text-center border-b mx-0">
          <Icon size="2xl" symbol="profile" />
          <h2 className="form-card__title">{t("nav.signIn")}</h2>
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
              validation={{ required: true }}
              error={errors.email}
              errorMessage="Please enter your login email"
              register={register}
              dataTestId="sign-in-email-field"
            />

            <aside className="float-right text-tiny font-semibold">
              <Link href="/forgot-password">
                <a>{t("authentication.signIn.forgotPassword")}</a>
              </Link>
            </aside>

            <Field
              caps={true}
              name="password"
              label={t("authentication.createAccount.password")}
              validation={{ required: true }}
              error={errors.password}
              errorMessage="Please enter your login password"
              register={register}
              type="password"
              dataTestId="sign-in-password-field"
            />

            <div className="text-center mt-6">
              <Button styleType={AppearanceStyleType.primary} data-test-id="sign-in-button">
                {t("nav.signIn")}
              </Button>
            </div>
          </Form>
        </div>
        <div className="form-card__group text-center">
          <h2 className="mb-6">{t("authentication.createAccount.noAccount")}</h2>

          <LinkButton href="/create-account">{t("account.createAccount")}</LinkButton>
        </div>
      </FormCard>
    </FormsLayout>
  )
}

export { SignIn as default, SignIn }
