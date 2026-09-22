import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
import Markdown from "markdown-to-jsx"
import { useRouter } from "next/router"
import React, { useEffect, useContext, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import {
  PageView,
  pushGtmEvent,
  AuthContext,
  BloomCard,
  Form,
  tIfExists,
} from "@bloom-housing/shared-helpers"
import { FeatureFlagEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { t, AlertBox } from "@bloom-housing/ui-components"
import { Button, Dialog, Heading } from "@bloom-housing/ui-seeds"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
import accountCardStyles from "./account/account.module.scss"
import {
  accountNameFields,
  createAccountPasswordFields,
  dobFields,
  emailFields,
} from "../components/account/AccountFieldHelpers"
import SignUpBenefits from "../components/account/SignUpBenefits"
import SignUpBenefitsHeadingGroup from "../components/account/SignUpBenefitsHeadingGroup"
import { TermsModal } from "../components/shared/TermsModal"
import FormsLayout from "../layouts/forms"
import { UserStatus } from "../lib/constants"
import { useJurisdictionFeatureFlags } from "../lib/JurisdictionFeatureFlagsContext"
import { sharedGetStaticProps } from "../lib/sharedPageProps"
import styles from "../../styles/create-account.module.scss"
import signUpBenefitsStyles from "../../styles/sign-up-benefits.module.scss"

dayjs.extend(customParseFormat)

const CreateAccount = () => {
  const { createPublicUser, resendConfirmation } = useContext(AuthContext)
  const [confirmationResent, setConfirmationResent] = useState<boolean>(false)
  const signUpCopy = process.env.showMandatedAccounts
  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, errors, watch, clearErrors } = useForm()
  const [requestError, setRequestError] = useState<string>()
  const [openEmailModal, setOpenEmailModal] = useState<boolean>(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const language = router.locale
  const listingId = router.query?.listingId as string
  const email = useRef({})
  email.current = watch("email", "")

  const featureFlags = useJurisdictionFeatureFlags()
  const enablePublicTermsOfUse = featureFlags?.some(
    (flag) => flag.name === FeatureFlagEnum.enablePublicTermsOfUse
  )

  const [openTermsModal, setOpenTermsModal] = useState<boolean>(false)
  const [isTermsLoading, setIsTermsLoading] = useState(false)
  const [notChecked, setChecked] = useState(true)

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Create Account",
      status: UserStatus.NotLoggedIn,
    })
  }, [])

  const onSubmit = async (data, isAcceptTerms) => {
    if (!isAcceptTerms && enablePublicTermsOfUse) {
      console.log(isAcceptTerms)
      setOpenTermsModal(true)
      return
    }
    setChecked(true)
    setLoading(true)
    try {
      if (enablePublicTermsOfUse) {
        setIsTermsLoading(true)
      }
      const { dob, ...rest } = data
      const listingIdRedirect =
        process.env.showMandatedAccounts && listingId ? listingId : undefined
      await createPublicUser(
        {
          ...rest,
          dob: dayjs(`${dob.birthYear}-${dob.birthMonth}-${dob.birthDay}`),
          language,
        },
        listingIdRedirect
      )

      if (process.env.showPwdless) {
        const redirectUrl = router.query?.redirectUrl as string
        const listingId = router.query?.listingId as string
        let queryParams: { [key: string]: string } = { email: data.email, flowType: "create" }
        if (redirectUrl) queryParams = { ...queryParams, redirectUrl }
        if (listingId) queryParams = { ...queryParams, listingId }

        await router.push({
          pathname: "/verify",
          query: queryParams,
        })
      } else {
        setOpenEmailModal(true)
      }
      if (enablePublicTermsOfUse) {
        setIsTermsLoading(false)
        setOpenTermsModal(false)
      }
      setLoading(false)
    } catch (err) {
      setLoading(false)
      if (enablePublicTermsOfUse) {
        setIsTermsLoading(false)
        setOpenTermsModal(false)
      }
      const { status, data } = err.response || {}
      if (status === 400) {
        setRequestError(`${t(`authentication.createAccount.errors.${data.message}`)}`)
      } else if (status === 409) {
        console.error(err)
        setRequestError(`${t("authentication.createAccount.errors.emailInUse")}`)
      } else {
        console.error(err)
        setRequestError(`${t("authentication.createAccount.errors.generic")}`)
      }
      window.scrollTo(0, 0)
    }
  }

  return (
    <FormsLayout
      className={signUpCopy ? "sm:max-w-lg md:max-w-full" : undefined}
      pageTitle={t("account.createAccount")}
      metaDescription={t("pageDescription.createAccount")}
    >
      <div className={signUpCopy ? signUpBenefitsStyles["benefits-container"] : undefined}>
        {signUpCopy && (
          <div className={signUpBenefitsStyles["benefits-display-hide"]}>
            <SignUpBenefitsHeadingGroup mobileView={true} />
          </div>
        )}
        <div className={signUpCopy ? signUpBenefitsStyles["benefits-form-container"] : undefined}>
          <BloomCard
            iconSymbol="userCircle"
            title={t("account.createAccount")}
            headingPriority={1}
            iconClass={"card-icon"}
            headingClass="seeds-large-heading"
          >
            <>
              {requestError && (
                <AlertBox onClose={() => setRequestError(undefined)} type="alert">
                  {requestError}
                </AlertBox>
              )}
              <Form id="create-account" onSubmit={handleSubmit((data) => onSubmit(data, false))}>
                {tIfExists("account.create.initialDisclaimer") && (
                  <CardSection
                    divider={"inset"}
                    className={accountCardStyles["account-card-settings-section"]}
                  >
                    <p className={`${accountCardStyles["section-sub-note"]} seeds-m-be-6`}>
                      {<Markdown>{t("account.create.initialDisclaimer")}</Markdown>}
                    </p>
                  </CardSection>
                )}
                <CardSection
                  divider={"inset"}
                  className={accountCardStyles["account-card-settings-section"]}
                >
                  {accountNameFields(errors, register, null, clearErrors)}
                </CardSection>
                <CardSection
                  divider={"inset"}
                  className={accountCardStyles["account-card-settings-section"]}
                >
                  {dobFields(errors, register, watch, null, true)}
                </CardSection>

                <CardSection
                  divider={"inset"}
                  className={accountCardStyles["account-card-settings-section"]}
                >
                  {emailFields(
                    errors,
                    register,
                    null,
                    clearErrors,
                    process.env.showPwdless
                      ? t("application.name.yourEmailAddressPwdlessHelper")
                      : null
                  )}
                </CardSection>
                <CardSection
                  divider={"inset"}
                  className={accountCardStyles["account-card-settings-section"]}
                >
                  <div className={"seeds-m-be-6"}>
                    {createAccountPasswordFields(errors, register, styles["create-account-input"])}
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    loadingMessage={loading ? t("t.loading") : undefined}
                  >
                    {t("account.createAccount")}
                  </Button>
                </CardSection>
                <CardSection
                  divider={"inset"}
                  className={accountCardStyles["account-card-settings-section"]}
                >
                  <Heading priority={2} size="2xl" className="mb-6 seeds-medium-heading">
                    {t("account.haveAnAccount")}
                  </Heading>
                  <Button href="/sign-in" variant="primary-outlined">
                    {t("nav.signIn")}
                  </Button>
                </CardSection>
                {enablePublicTermsOfUse && (
                  <TermsModal
                    control={{ register, errors, handleSubmit }}
                    isTermsLoading={isTermsLoading}
                    notChecked={notChecked}
                    onSubmit={(data) => onSubmit(data, true)}
                    openTermsModal={openTermsModal}
                    setChecked={setChecked}
                    setOpenTermsModal={setOpenTermsModal}
                  />
                )}
              </Form>
            </>
          </BloomCard>
        </div>
        {signUpCopy && (
          <div className={signUpBenefitsStyles["benefits-hide-display"]}>
            <div className={signUpBenefitsStyles["benefits-desktop-container"]}>
              <SignUpBenefitsHeadingGroup mobileView={false} />
              <SignUpBenefits idTag="desktop" />
            </div>
          </div>
        )}
        {signUpCopy && (
          <div className={signUpBenefitsStyles["benefits-display-hide"]}>
            <SignUpBenefits idTag="mobile" />
          </div>
        )}
      </div>

      <Dialog
        isOpen={openEmailModal}
        onClose={() => {
          void router.push("/sign-in")
          window.scrollTo(0, 0)
        }}
        ariaLabelledBy="create-account-dialog-header"
        ariaDescribedBy="create-account-dialog-content"
      >
        <Dialog.Header id="create-account-dialog-header">
          {t("authentication.createAccount.confirmationNeeded")}
        </Dialog.Header>
        <Dialog.Content id="create-account-dialog-content">
          <p>{t("authentication.createAccount.anEmailHasBeenSent", { email: email.current })}</p>
          <p>{t("authentication.createAccount.confirmationInstruction")}</p>
        </Dialog.Content>
        <Dialog.Footer>
          <Button
            variant="primary"
            onClick={() => {
              void router.push("/sign-in")
              window.scrollTo(0, 0)
            }}
            size="sm"
          >
            {t("t.ok")}
          </Button>
          <Button
            variant="primary-outlined"
            disabled={confirmationResent}
            onClick={() => {
              setConfirmationResent(true)
              void resendConfirmation(email.current.toString(), listingId)
            }}
            size="sm"
          >
            {t("authentication.createAccount.resendTheEmail")}
          </Button>
        </Dialog.Footer>
      </Dialog>
    </FormsLayout>
  )
}

export default CreateAccount

export const getStaticProps = sharedGetStaticProps
