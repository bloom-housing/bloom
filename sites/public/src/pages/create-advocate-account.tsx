import React, { useContext, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/router"
import { Form, t, AlertBox } from "@bloom-housing/ui-components"
import { Agency } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { Button, Heading } from "@bloom-housing/ui-seeds"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
import { PageView, pushGtmEvent, BloomCard, AuthContext } from "@bloom-housing/shared-helpers"
import { fetchAgencies, fetchJurisdictionByName } from "../lib/hooks"
import { UserStatus } from "../lib/constants"
import FormsLayout from "../layouts/forms"
import {
  accountNameFields,
  agencyFields,
  emailFields,
} from "../components/account/AccountFieldHelpers"
import accountCardStyles from "./account/account.module.scss"

interface CreateAdvocateAccountProps {
  agencies: Agency[]
}

const CreateAdvocateAccount = ({ agencies }: CreateAdvocateAccountProps) => {
  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, errors, clearErrors } = useForm()
  const [requestError, setRequestError] = useState<string>()
  const [submitLoading, setSubmitLoading] = useState(false)

  const { createAdvocateUser } = useContext(AuthContext)
  const router = useRouter()

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Create Advocate Account",
      status: UserStatus.NotLoggedIn,
    })
  }, [])

  const onSubmit = async (data) => {
    setSubmitLoading(true)
    try {
      await createAdvocateUser({
        ...data,
        agency: { id: data.agencyId },
      })
      await router.push("create-advocate-account-confirmation")
    } catch (err) {
      setSubmitLoading(false)
      const { status, data } = err.response || {}
      console.error(err)
      if (status === 400) {
        setRequestError(`${t(`authentication.createAccount.errors.${data.message}`)}`)
      } else if (status === 409) {
        if (err.response?.data?.message === "advocateNeedsApproval") {
          setRequestError(`${t("authentication.requestAdvocateAccount.unapprovedError")}`)
        } else {
          setRequestError(`${t("authentication.createAccount.errors.emailInUse")}`)
        }
      } else {
        setRequestError(`${t("authentication.createAccount.errors.generic")}`)
      }
      window.scrollTo(0, 0)
    }
  }

  return (
    <FormsLayout pageTitle={t("advocateAccount.requestAccountTitle")}>
      <BloomCard
        iconSymbol="userCircle"
        title={t("advocateAccount.requestAccountTitle")}
        subtitle={t("advocateAccount.subtitle")}
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
          <Form id="create-advocate-account" onSubmit={handleSubmit(onSubmit)}>
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
              {agencyFields(errors, register, null, agencies)}
            </CardSection>
            <CardSection
              divider={"inset"}
              className={accountCardStyles["account-card-settings-section"]}
            >
              <div className={"seeds-m-be-6"}>
                {emailFields(errors, register, null, clearErrors, t("advocateAccount.emailNote"))}
              </div>
              <Button
                type="submit"
                variant="primary"
                loadingMessage={submitLoading ? t("t.loading") : undefined}
              >
                {t("advocateAccount.requestAccountTitle")}
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
          </Form>
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
