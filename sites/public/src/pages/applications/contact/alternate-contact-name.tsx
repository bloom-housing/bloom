import React, { useContext, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Form, Field, t } from "@bloom-housing/ui-components"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
import { Alert } from "@bloom-housing/ui-seeds"
import { OnClientSide, PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import FormsLayout from "../../../layouts/forms"
import { useFormConductor } from "../../../lib/hooks"
import { UserStatus } from "../../../lib/constants"
import ApplicationFormLayout from "../../../layouts/application-form"
import styles from "../../../layouts/application-form.module.scss"

const ApplicationAlternateContactName = () => {
  const { profile } = useContext(AuthContext)
  const { conductor, application, listing } = useFormConductor("alternateContactName")
  const currentPageSection = 1

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, errors, trigger } = useForm<Record<string, any>>({
    shouldFocusError: false,
  })
  const onSubmit = async (data) => {
    const validation = await trigger()
    if (!validation) return

    application.alternateContact.firstName = data.firstName
    application.alternateContact.lastName = data.lastName
    application.alternateContact.agency = data.agency
    conductor.sync()
    conductor.routeToNextOrReturnUrl()
  }
  const onError = () => {
    window.scrollTo(0, 0)
  }

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Application - Alternate Contact Name",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  return (
    <FormsLayout>
      <Form id="applications-contact-alternate-name" onSubmit={handleSubmit(onSubmit, onError)}>
        <ApplicationFormLayout
          listingName={listing?.name}
          heading={t("application.alternateContact.name.title")}
          progressNavProps={{
            currentPageSection: currentPageSection,
            completedSections: application.completedSections,
            labels: conductor.config.sections.map((label) => t(`t.${label}`)),
            mounted: OnClientSide(),
          }}
          backLink={{
            url: conductor.determinePreviousUrl(),
          }}
          conductor={conductor}
        >
          {Object.entries(errors).length > 0 && (
            <Alert
              className={styles["message-inside-card"]}
              variant="alert"
              fullwidth
              id={"application-alert-box"}
            >
              {t("errors.errorsToResolve")}
            </Alert>
          )}
          <CardSection divider={"flush"} className={"border-none"}>
            <fieldset>
              <legend className="text__caps-spaced">
                {t("application.alternateContact.name.alternateContactFormLabel")}
              </legend>
              <Field
                id="firstName"
                name="firstName"
                label={t("application.contact.givenName")}
                defaultValue={application.alternateContact.firstName}
                validation={{ required: true, maxLength: 64 }}
                errorMessage={
                  errors.firstName?.type === "maxLength"
                    ? t("errors.maxLength", { length: 64 })
                    : t("errors.givenNameError")
                }
                error={errors.firstName}
                register={register}
                dataTestId={"app-alternate-first-name"}
              />
              <Field
                id="lastName"
                name="lastName"
                label={t("application.contact.familyName")}
                defaultValue={application.alternateContact.lastName}
                validation={{ required: true, maxLength: 64 }}
                error={errors.lastName}
                errorMessage={
                  errors.lastName?.type === "maxLength"
                    ? t("errors.maxLength", { length: 64 })
                    : t("errors.familyNameError")
                }
                register={register}
                dataTestId={"app-alternate-last-name"}
              />
              {application.alternateContact.type === "caseManager" && (
                <div className="mt-6">
                  <p className="text__caps-spaced">
                    {t("application.alternateContact.name.caseManagerAgencyFormLabel")}
                  </p>
                  <Field
                    id="agency"
                    name="agency"
                    label={t("application.alternateContact.name.caseManagerAgencyFormPlaceHolder")}
                    defaultValue={application.alternateContact.agency}
                    validation={{ required: true }}
                    error={errors.agency}
                    errorMessage={t(
                      "application.alternateContact.name.caseManagerAgencyValidationErrorMessage"
                    )}
                    register={register}
                    dataTestId={"app-alternate-type"}
                  />
                </div>
              )}
            </fieldset>
          </CardSection>
        </ApplicationFormLayout>
      </Form>
    </FormsLayout>
  )
}

export default ApplicationAlternateContactName
