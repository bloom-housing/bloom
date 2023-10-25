import React, { useContext, useEffect } from "react"
import { useForm } from "react-hook-form"
import { AlertBox, Form, Field, t } from "@bloom-housing/ui-components"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
import { OnClientSide, PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import FormsLayout from "../../../layouts/forms"
import { useFormConductor } from "../../../lib/hooks"
import { UserStatus } from "../../../lib/constants"
import ApplicationFormLayout from "../../../layouts/application-form"

export default () => {
  const { profile } = useContext(AuthContext)
  const { conductor, application, listing } = useFormConductor("alternateContactName")
  const currentPageSection = 1

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, errors } = useForm<Record<string, any>>({
    shouldFocusError: false,
  })
  const onSubmit = (data) => {
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
            <AlertBox type="alert" inverted closeable>
              {t("errors.errorsToResolve")}
            </AlertBox>
          )}
          <CardSection divider={"flush"} className={"border-none"}>
            <fieldset>
              <legend className="text__caps-spaced">
                {t("application.alternateContact.name.alternateContactFormLabel")}
              </legend>
              <Field
                id="firstName"
                name="firstName"
                label={t("application.name.firstName")}
                readerOnly={true}
                placeholder={t("application.name.firstName")}
                defaultValue={application.alternateContact.firstName}
                validation={{ required: true, maxLength: 64 }}
                errorMessage={
                  errors.firstName?.type === "maxLength"
                    ? t("errors.maxLength")
                    : t("errors.firstNameError")
                }
                error={errors.firstName}
                register={register}
                dataTestId={"app-alternate-first-name"}
              />
              <Field
                id="lastName"
                name="lastName"
                label={t("application.name.lastName")}
                readerOnly={true}
                placeholder={t("application.name.lastName")}
                defaultValue={application.alternateContact.lastName}
                validation={{ required: true, maxLength: 64 }}
                error={errors.lastName}
                errorMessage={
                  errors.lastName?.type === "maxLength"
                    ? t("errors.maxLength")
                    : t("errors.lastNameError")
                }
                register={register}
                dataTestId={"app-alternate-last-name"}
              />
              {application.alternateContact.type === "caseManager" && (
                <div className="mt-6">
                  <Field
                    id="agency"
                    name="agency"
                    label={t("application.alternateContact.name.caseManagerAgencyFormLabel")}
                    caps={true}
                    placeholder={t(
                      "application.alternateContact.name.caseManagerAgencyFormPlaceHolder"
                    )}
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
