import React, { useContext, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/router"
import { Field, Form, t, AlertBox, Select } from "@bloom-housing/ui-components"
import { Agency } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { Button, Heading } from "@bloom-housing/ui-seeds"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
import {
  PageView,
  pushGtmEvent,
  BloomCard,
  emailRegex,
  AuthContext,
} from "@bloom-housing/shared-helpers"
import { fetchAgencies, fetchJurisdictionByName } from "../lib/hooks"
import { UserStatus } from "../lib/constants"
import FormsLayout from "../layouts/forms"
import accountCardStyles from "./account/account.module.scss"
import styles from "../../styles/create-account.module.scss"

interface CreateAdvocateAccountProps {
  agencies: Agency[]
}

const CreateAdvocateAccount = ({ agencies }: CreateAdvocateAccountProps) => {
  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, errors } = useForm()
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
        agency: { id: data.agency },
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
              <fieldset id="userName">
                <legend className={"text__caps-spaced"}>{t("application.name.yourName")}</legend>
                <label className={styles["create-account-field"]} htmlFor="firstName">
                  {t("application.name.firstOrGivenName")}
                </label>
                <Field
                  controlClassName={styles["create-account-input"]}
                  name="firstName"
                  validation={{ required: true, maxLength: 64 }}
                  error={errors.firstName}
                  errorMessage={
                    errors.firstName?.type === "maxLength"
                      ? t("errors.maxLength", { length: 64 })
                      : t("errors.firstNameError")
                  }
                  register={register}
                />
                <label className={styles["create-account-field"]} htmlFor="middleName">
                  {t("application.name.middleNameOptional")}
                </label>
                <Field
                  name="middleName"
                  register={register}
                  error={errors.middleName}
                  validation={{ maxLength: 64 }}
                  errorMessage={t("errors.maxLength", { length: 64 })}
                  controlClassName={styles["create-account-input"]}
                />

                <label className={styles["create-account-field"]} htmlFor="lastName">
                  {t("application.name.lastOrFamilyName")}
                </label>
                <Field
                  name="lastName"
                  validation={{ required: true, maxLength: 64 }}
                  error={errors.lastName}
                  register={register}
                  errorMessage={
                    errors.lastName?.type === "maxLength"
                      ? t("errors.maxLength", { length: 64 })
                      : t("errors.lastNameError")
                  }
                  controlClassName={styles["create-account-input"]}
                />
              </fieldset>
            </CardSection>

            <CardSection
              divider={"inset"}
              className={accountCardStyles["account-card-settings-section"]}
            >
              <p className={"text__caps-spaced"}>{t("advocateAccount.organizationHeading")}</p>
              <Select
                id="agency"
                name="agency"
                validation={{ required: true }}
                error={errors?.agency}
                errorMessage={t("errors.requiredFieldError")}
                register={register}
                controlClassName={"control"}
                labelClassName={styles["create-account-field"]}
                label={t("advocateAccount.agencyLabel")}
                options={[
                  { value: "", label: "" },
                  ...agencies.map((agency) => ({
                    id: agency.id,
                    label: agency.name,
                    value: agency.id,
                    dataTestId: agency.name,
                  })),
                ]}
                dataTestId={"agency"}
                subNote={t("advocateAccount.agencyNotListed")}
              />
            </CardSection>
            <CardSection
              divider={"inset"}
              className={accountCardStyles["account-card-settings-section"]}
            >
              <label className={"text__caps-spaced"} htmlFor="email">
                {t("application.name.yourEmailAddress")}
              </label>
              <Field
                type="email"
                name="email"
                validation={{ required: true, pattern: emailRegex }}
                error={errors.email}
                errorMessage={t("authentication.signIn.loginError")}
                register={register}
                controlClassName={styles["create-account-input"]}
                labelClassName={"text__caps-spaced sr-only"}
                note={t("advocateAccount.emailNote")}
                subNote={t("advocateAccount.emailSubNote")}
              />
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
