import React, { Fragment, useContext, useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { FormErrorMessage } from "@bloom-housing/ui-seeds"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
import { Field, Form, t } from "@bloom-housing/ui-components"
import {
  altContactRelationshipKeys,
  AuthContext,
  OnClientSide,
  PageView,
  pushGtmEvent,
} from "@bloom-housing/shared-helpers"
import FormsLayout from "../../../layouts/forms"
import { useFormConductor } from "../../../lib/hooks"
import { UserStatus } from "../../../lib/constants"
import {
  ApplicationFormLayout,
  ApplicationAlertBox,
  onFormError,
} from "../../../layouts/application-form"

const ApplicationAlternateContactType = () => {
  const { profile } = useContext(AuthContext)
  const { conductor, application, listing } = useFormConductor("alternateContactType")
  const currentPageSection = 1

  const alertRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, errors, watch, trigger } = useForm<Record<string, any>>({
    shouldFocusError: false,
  })
  const onSubmit = async (data) => {
    const validation = await trigger()
    if (!validation) return

    application.alternateContact.type = data.type
    application.alternateContact.otherType = data.otherType

    if (data.type === "noContact") conductor.completeSection(1)

    conductor.sync()
    conductor.routeToNextOrReturnUrl()
  }
  const onError = () => {
    onFormError("application-alert-box-wrapper")
  }
  const type = watch("type", application.alternateContact.type)

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Application - Alternate Contact Type",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  return (
    <FormsLayout
      pageTitle={`${t("pageTitle.alternateContactType")} - ${t("listings.apply.applyOnline")} - ${
        listing?.name
      }`}
    >
      <Form id="applications-contact-alternate-type" onSubmit={handleSubmit(onSubmit, onError)}>
        <ApplicationFormLayout
          listingName={listing?.name}
          heading={t("application.alternateContact.type.title")}
          subheading={t("application.alternateContact.type.description")}
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
          <ApplicationAlertBox errors={errors} alertRef={alertRef} />
          <CardSection divider={"flush"} className={"border-none"}>
            <fieldset>
              <legend className={`text__caps-spaced ${errors?.type ? "text-alert" : ""}`}>
                {t("application.alternateContact.type.label")}
              </legend>
              <p className="field-note mb-4">{t("t.pleaseSelectOne")}</p>
              {altContactRelationshipKeys.map((option, i) => {
                return (
                  <Fragment key={option}>
                    <Field
                      className="mb-1"
                      key={option}
                      type="radio"
                      id={"type-" + option}
                      name="type"
                      label={t("application.alternateContact.type.options." + option)}
                      register={register}
                      validation={{ required: true }}
                      error={errors.type}
                      inputProps={{
                        value: option,
                        defaultChecked: application.alternateContact.type === option,
                        "aria-controls": option === "other" ? "other-type" : undefined,
                      }}
                      dataTestId={"app-alternate-type"}
                    />
                    <div id="other-type">
                      {option === "other" && type === "other" && (
                        <Field
                          className={"seeds-p-be-4"}
                          id="otherType"
                          name="otherType"
                          label={t("application.alternateContact.type.otherTypeFormPlaceholder")}
                          defaultValue={application.alternateContact.otherType}
                          validation={{ required: true, maxLength: 64 }}
                          error={errors.otherType}
                          errorMessage={
                            errors.otherType?.type === "maxLength"
                              ? t("errors.maxLength", { length: 64 })
                              : t(
                                  "application.alternateContact.type.otherTypeValidationErrorMessage"
                                )
                          }
                          register={register}
                          dataTestId={"app-alternate-other-type"}
                        />
                      )}
                    </div>

                    {i === altContactRelationshipKeys.length - 1 && (
                      <>
                        {errors.type && (
                          <FormErrorMessage id="type-error">
                            {t("application.alternateContact.type.validationErrorMessage")}
                          </FormErrorMessage>
                        )}
                      </>
                    )}
                  </Fragment>
                )
              })}
            </fieldset>
          </CardSection>
        </ApplicationFormLayout>
      </Form>
    </FormsLayout>
  )
}

export default ApplicationAlternateContactType
