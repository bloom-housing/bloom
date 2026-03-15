import React, { useContext, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/router"
import { Form, t, AlertBox, Field } from "@bloom-housing/ui-components"
import { Agency, User } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { Button, LoadingState } from "@bloom-housing/ui-seeds"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
import { BloomCard, AuthContext, emailRegex } from "@bloom-housing/shared-helpers"
import { fetchAgencies, fetchJurisdictionByName } from "../lib/hooks"
import FormsLayout from "../layouts/forms"
import {
  accountNameFields,
  agencyFields,
  addressFields,
  phoneFields,
  createAccountPasswordFields,
} from "../components/account/AccountFieldHelpers"
import accountCardStyles from "./account/account.module.scss"

type PageState = "loading" | "form" | "expired" | "resent"

interface CreateAdvocateAccountProps {
  agencies: Agency[]
}

const CreateAdvocateAccount = ({ agencies }: CreateAdvocateAccountProps) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, errors, clearErrors, watch, control, setValue, reset } = useForm()
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const {
    register: resendRegister,
    handleSubmit: resendHandleSubmit,
    errors: resendErrors,
  } = useForm()

  const [pageState, setPageState] = useState<PageState>("loading")
  const [existingUser, setExistingUser] = useState<User | null>(null)
  const [requestError, setRequestError] = useState<string>()
  const [submitLoading, setSubmitLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)

  const { authService, userService, loadProfile, initialStateLoaded } = useContext(AuthContext)
  const router = useRouter()
  const hasCheckedToken = useRef(false)

  const token = router.query.token as string

  const password = useRef({})
  password.current = watch("password", "")

  const isPOBoxSelected = watch("isPOBox", "no") === "yes"
  const hasAdditionalPhone = watch("hasAdditionalPhone", false)

  useEffect(() => {
    if (!token || !initialStateLoaded || hasCheckedToken.current) return
    hasCheckedToken.current = true

    const fetchAdvocate = async () => {
      try {
        const user = await userService.getAdvocateFromConfirmationToken({ body: { token } })
        setExistingUser(user)
        reset({
          firstName: user.firstName,
          middleName: user.middleName,
          lastName: user.lastName,
          agencyId: user.agency?.id,
        })
        setPageState("form")
      } catch (_) {
        setPageState("expired")
      }
    }
    void fetchAdvocate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, initialStateLoaded])

  const onSubmit = async (data) => {
    setSubmitLoading(true)
    setRequestError(undefined)
    try {
      await authService.confirm({ body: { token, password: data.password } })

      const user = await userService.profile()

      const poBoxValue = (data.poBox || "").replace(/^po box\s*/i, "").trim()
      const streetValue = data.isPOBox === "yes" ? `PO Box ${poBoxValue}` : data.street || ""

      await userService.updateAdvocate({
        body: {
          ...user,
          firstName: data.firstName,
          middleName: data.middleName,
          lastName: data.lastName,
          agency: data.agencyId ? { id: data.agencyId } : user.agency,
          address: {
            ...(user?.address || {}),
            street: streetValue,
            street2: data.isPOBox === "yes" ? "" : data.street2,
            city: data.city,
            state: data.state,
            zipCode: data.zipCode,
          },
          phoneNumber: data.phoneNumber,
          phoneType: data.phoneType,
          phoneExtension: data.phoneExtension || undefined,
          additionalPhoneNumber: data.hasAdditionalPhone ? data.additionalPhoneNumber : undefined,
          additionalPhoneNumberType: data.hasAdditionalPhone
            ? data.additionalPhoneNumberType
            : undefined,
          additionalPhoneExtension: data.hasAdditionalPhone
            ? data.additionalPhoneExtension
            : undefined,
        },
      })

      loadProfile("/account/dashboard?alert=account.settings.alerts.accountCreated")
    } catch (_) {
      setSubmitLoading(false)
      setRequestError(`${t("authentication.createAccount.errors.generic")}`)
      window.scrollTo(0, 0)
    }
  }

  const onResend = async (data: { resendEmail: string }) => {
    setResendLoading(true)
    setRequestError(undefined)
    try {
      await userService.resendAdvocateConfirmation({
        body: { email: data.resendEmail, appUrl: window.location.origin },
      })
      setPageState("resent")
    } catch (error) {
      const status = (error as { response?: { status?: number } })?.response?.status

      if (status === 404) {
        setPageState("resent")
      } else {
        setRequestError(`${t("authentication.createAccount.errors.generic")}`)
        window.scrollTo(0, 0)
      }
    } finally {
      setResendLoading(false)
    }
  }

  const getCardTitle = () => {
    switch (pageState) {
      case "form":
        return t("advocateAccount.completeAccountTitle")
      case "expired":
        return t("advocateAccount.linkExpiredTitle")
      case "resent":
        return t("advocateAccount.resendLinkSuccessTitle")
      default:
        return ""
    }
  }

  const formContent = (
    <>
      <Form id="complete-advocate-account" onSubmit={handleSubmit(onSubmit)}>
        <LoadingState loading={submitLoading}>
          <CardSection
            divider={"inset"}
            className={accountCardStyles["account-card-settings-section"]}
          >
            {accountNameFields(errors, register, existingUser, clearErrors)}
          </CardSection>
          <CardSection
            divider={"inset"}
            className={accountCardStyles["account-card-settings-section"]}
          >
            {agencyFields(errors, register, existingUser, agencies)}
          </CardSection>
          <CardSection
            divider={"inset"}
            className={accountCardStyles["account-card-settings-section"]}
          >
            {addressFields(errors, register, null, isPOBoxSelected, false)}
          </CardSection>
          <CardSection
            divider={"inset"}
            className={accountCardStyles["account-card-settings-section"]}
          >
            {phoneFields(errors, register, control, setValue, null, hasAdditionalPhone)}
          </CardSection>
          <CardSection
            divider={"inset"}
            className={accountCardStyles["account-card-settings-section"]}
          >
            <div className={"seeds-m-be-6"}>
              {createAccountPasswordFields(errors, register, password)}
            </div>
            <Button
              type="submit"
              variant="primary"
              loadingMessage={submitLoading ? t("t.loading") : undefined}
            >
              {t("t.submit")}
            </Button>
          </CardSection>
        </LoadingState>
      </Form>
    </>
  )

  const resendContent = (
    <>
      <CardSection className={accountCardStyles["account-card-settings-section"]}>
        <p className={`${accountCardStyles["card-content"]} seeds-m-be-6`}>
          {t("advocateAccount.linkExpiredMessage")}
        </p>
        <Form id="resend-advocate-confirmation" onSubmit={resendHandleSubmit(onResend)}>
          <Field
            name="resendEmail"
            type="email"
            label={t("application.name.yourEmailAddress")}
            register={resendRegister}
            validation={{ required: true, pattern: emailRegex }}
            error={resendErrors.resendEmail}
            errorMessage={t("errors.emailAddressError")}
            className="seeds-m-be-4"
          />
          <Button
            type="submit"
            variant="primary"
            loadingMessage={resendLoading ? t("t.loading") : undefined}
          >
            {t("advocateAccount.resendLink")}
          </Button>
        </Form>
      </CardSection>
    </>
  )

  return (
    <FormsLayout pageTitle={t("advocateAccount.completeAccountTitle")}>
      <BloomCard
        iconSymbol={"userCircle"}
        iconClass={"card-icon"}
        title={getCardTitle()}
        headingClass={"seeds-large-heading"}
        subtitle={pageState === "form" ? t("advocateAccount.completeAccountSubtitle") : null}
      >
        <>
          {requestError && (
            <AlertBox onClose={() => setRequestError(undefined)} type="alert">
              {requestError}
            </AlertBox>
          )}
          <LoadingState loading={pageState === "loading"}>
            {pageState === "form" && formContent}
            {pageState === "resent" && (
              <CardSection>
                <p className={accountCardStyles["card-content"]}>
                  {t("advocateAccount.resendLinkSuccess")}
                </p>
              </CardSection>
            )}
            {pageState === "expired" && resendContent}
          </LoadingState>
        </>
      </BloomCard>
    </FormsLayout>
  )
}

export default CreateAdvocateAccount

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getServerSideProps(context: { req: any; query: any }) {
  const jurisdiction = await fetchJurisdictionByName(context.req)
  const agencies = await fetchAgencies(context.req, jurisdiction?.id)

  return {
    props: { jurisdiction, agencies: agencies?.items || [] },
  }
}
