import React, { useState, useContext } from "react"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import { Button, Card } from "@bloom-housing/ui-seeds"
import { PasswordField, t, AlertBox } from "@bloom-housing/ui-components"
import { AuthContext, BloomCard, Form, MessageContext } from "@bloom-housing/shared-helpers"
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
  const { register, handleSubmit, errors } = useForm()
  const [requestError, setRequestError] = useState<string>()
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (data: { password: string }) => {
    const { password } = data

    try {
      setIsLoading(true)
      const user = await resetPassword(token.toString(), password)
      await router.push("/")
      window.scrollTo(0, 0)
      addToast(t(`authentication.signIn.success`, { name: user.firstName }), { variant: "success" })
    } catch (err) {
      setIsLoading(false)
      const { status, data } = err.response || {}
      if (status === 400) {
        setRequestError(`${t(`authentication.forgotPassword.errors.${data.message}`)}`)
      } else {
        console.error(err)
        setRequestError(
          `${t("account.settings.alerts.genericError", {
            contactEmail: t("resources.contactEmail"),
          })}`
        )
      }
    }
  }

  return (
    <FormsLayout
      title={`${t("authentication.forgotPassword.changePassword")} - ${t("nav.siteTitlePartners")}`}
    >
      <BloomCard
        iconSymbol="userCircle"
        title={t("authentication.forgotPassword.changePassword")}
        headingPriority={1}
        iconClass={"card-icon"}
        iconOutlined={true}
        headingClass="seeds-large-heading"
      >
        <Form id="sign-in" onSubmit={handleSubmit(onSubmit)}>
          <Card.Section>
            {requestError && (
              <AlertBox
                className="seeds-m-be-4"
                onClose={() => setRequestError(undefined)}
                type="alert"
              >
                {requestError}
              </AlertBox>
            )}
            <fieldset>
              <legend className="text__caps-spaced sr-only">
                {t("authentication.forgotPassword.changePassword")}
              </legend>
              <PasswordField
                name="password"
                label={t("authentication.createAccount.password")}
                validation={{ required: true }}
                error={errors.password}
                errorMessage={t("authentication.forgotPassword.enterNewLoginPassword")}
                register={register}
                labelClassName={"text__caps-spaced"}
              />
            </fieldset>
          </Card.Section>

          <Card.Section className={"primary-bg seeds-m-bs-section"}>
            <Button
              type="submit"
              variant="primary"
              loadingMessage={isLoading ? t("t.loading") : null}
            >
              {t("authentication.forgotPassword.changePassword")}
            </Button>
          </Card.Section>
        </Form>
      </BloomCard>
    </FormsLayout>
  )
}

export { ResetPassword as default, ResetPassword }
