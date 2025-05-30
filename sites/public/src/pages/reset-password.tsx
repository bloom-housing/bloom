import React, { useEffect, useState, useContext, useRef } from "react"
import { isAxiosError } from "axios"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import { Field, Form, t, AlertBox } from "@bloom-housing/ui-components"
import { Button } from "@bloom-housing/ui-seeds"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
import {
  PageView,
  pushGtmEvent,
  AuthContext,
  BloomCard,
  MessageContext,
} from "@bloom-housing/shared-helpers"
import { TermsModal } from "../components/shared/TermsModal"
import { UserStatus } from "../lib/constants"
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
  const [loading, setLoading] = useState(false)
  const [openTermsModal, setOpenTermsModal] = useState<boolean>(false)
  const [notChecked, setChecked] = useState(true)

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
    setLoading(true)
    const { password, passwordConfirmation } = data

    try {
      const user = await resetPassword(
        token.toString(),
        password,
        passwordConfirmation,
        !notChecked ? true : undefined
      )
      addToast(t(`authentication.signIn.success`, { name: user.firstName }), { variant: "success" })

      const redirectUrl = "/applications/start/choose-language"
      const listingId = router.query?.listingId as string

      const routerRedirectUrl =
        process.env.showMandatedAccounts && redirectUrl && listingId
          ? `${redirectUrl}?listingId=${listingId}`
          : "/account/applications"

      await router.push(routerRedirectUrl)
    } catch (error) {
      setLoading(false)
      setOpenTermsModal(false)
      setChecked(true)
      const { status, data } = error.response || {}
      const responseMessage = isAxiosError(error) ? error.response?.data.message : ""

      if (status === 400 && responseMessage?.includes("has not accepted the terms of service")) {
        setOpenTermsModal(true)
      } else if (status === 400) {
        setRequestError(`${t(`authentication.forgotPassword.errors.${data.message}`)}`)
      } else {
        console.error(error)
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

              <Button
                type="submit"
                variant="primary"
                loadingMessage={loading ? t("t.loading") : undefined}
              >
                {t("authentication.forgotPassword.changePassword")}
              </Button>
            </Form>
          </CardSection>
        </>
      </BloomCard>
      <TermsModal
        control={{ register, errors, handleSubmit }}
        onSubmit={onSubmit}
        notChecked={notChecked}
        setChecked={setChecked}
        openTermsModal={openTermsModal}
        setOpenTermsModal={setOpenTermsModal}
      />
    </FormsLayout>
  )
}

export { ResetPassword as default, ResetPassword }
