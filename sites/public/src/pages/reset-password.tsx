import { isAxiosError } from "axios"
import { useRouter } from "next/router"
import React, { useEffect, useState, useContext } from "react"
import { useForm } from "react-hook-form"
import {
  PageView,
  pushGtmEvent,
  AuthContext,
  BloomCard,
  Form,
  MessageContext,
  isInternalLink,
} from "@bloom-housing/shared-helpers"
import { FeatureFlagEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { PasswordField, t, AlertBox } from "@bloom-housing/ui-components"
import { Button } from "@bloom-housing/ui-seeds"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
import { TermsModal } from "../components/shared/TermsModal"
import FormsLayout from "../layouts/forms"
import { UserStatus } from "../lib/constants"
import { useJurisdictionFeatureFlags } from "../lib/JurisdictionFeatureFlagsContext"
import { sharedGetStaticProps } from "../lib/sharedPageProps"

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
  const [loading, setLoading] = useState(false)
  const [openTermsModal, setOpenTermsModal] = useState<boolean>(false)
  const [notChecked, setChecked] = useState(true)

  const featureFlags = useJurisdictionFeatureFlags()
  const enablePublicTermsOfUse = featureFlags?.some(
    (flag) => flag.name === FeatureFlagEnum.enablePublicTermsOfUse
  )

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Reset Password",
      status: UserStatus.NotLoggedIn,
    })
  }, [])

  const onSubmit = async (data: { password: string }) => {
    setLoading(true)
    const { password } = data

    try {
      const user = await resetPassword(token.toString(), password, !notChecked ? true : undefined)
      const redirectUrl = router.query?.redirectUrl as string
      const listingId = router.query?.listingId as string

      const routerRedirectUrl =
        process.env.showMandatedAccounts && redirectUrl && listingId && isInternalLink(redirectUrl)
          ? `${redirectUrl}?listingId=${listingId}`
          : "/account/applications"
      addToast(t(`authentication.signIn.success`, { name: user.firstName }), { variant: "success" })
      await router.push(routerRedirectUrl)
    } catch (error) {
      setLoading(false)
      if (enablePublicTermsOfUse) {
        setOpenTermsModal(false)
        setChecked(true)
      }
      const { status, data } = error.response || {}
      const responseMessage = isAxiosError(error) ? error.response?.data.message : ""

      if (
        enablePublicTermsOfUse &&
        status === 400 &&
        responseMessage?.includes("has not accepted the terms of service")
      ) {
        setOpenTermsModal(true)
      } else if (status === 400) {
        setRequestError(`${t(`authentication.forgotPassword.errors.${data.message}`)}`)
      } else {
        console.error(error)
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
      pageTitle={t("pageTitle.resetPassword")}
      metaDescription={t("pageDescription.resetPassword")}
    >
      <BloomCard
        title={t("authentication.forgotPassword.changePassword")}
        iconSymbol={"userCircle"}
        iconClass={"card-icon"}
        headingClass={"seeds-large-heading"}
      >
        <>
          {requestError && (
            <AlertBox className="mt-6" onClose={() => setRequestError(undefined)} type="alert">
              {requestError}
            </AlertBox>
          )}
          <CardSection>
            <Form id="sign-in" onSubmit={handleSubmit(onSubmit)}>
              <p className="field-label mb-2">{t("authentication.createAccount.passwordInfo")}</p>
              <PasswordField
                name="password"
                label={t("authentication.createAccount.password")}
                labelClassName={"text__caps-spaced"}
                showPasswordLabel={t("authentication.createAccount.showPassword")}
                validation={{ required: true }}
                error={errors.password}
                errorMessage={t("authentication.forgotPassword.enterNewLoginPassword")}
                register={register}
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
        notChecked={notChecked}
        onSubmit={onSubmit}
        openTermsModal={openTermsModal}
        setChecked={setChecked}
        setOpenTermsModal={setOpenTermsModal}
      />
    </FormsLayout>
  )
}

export { ResetPassword as default, ResetPassword }

export const getStaticProps = sharedGetStaticProps
