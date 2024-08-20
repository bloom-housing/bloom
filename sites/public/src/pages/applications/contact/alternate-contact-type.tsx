import React, { Fragment, useContext, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Alert, FormErrorMessage } from "@bloom-housing/ui-seeds"
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
import ApplicationFormLayout from "../../../layouts/application-form"
import styles from "../../../layouts/application-form.module.scss"

const ApplicationAlternateContactType = () => {
  const { profile } = useContext(AuthContext)
  const { conductor, application, listing } = useFormConductor("alternateContactType")
  const currentPageSection = 1

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
    window.scrollTo(0, 0)
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
    <FormsLayout>
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
                      }}
                      dataTestId={"app-alternate-type"}
                    />

                    {option === "other" && type === "other" && (
                      <Field
                        controlClassName="mt-4"
                        id="otherType"
                        name="otherType"
                        label={t("application.alternateContact.type.otherTypeFormPlaceholder")}
                        defaultValue={application.alternateContact.otherType}
                        validation={{ required: true, maxLength: 64 }}
                        error={errors.otherType}
                        errorMessage={
                          errors.otherType?.type === "maxLength"
                            ? t("errors.maxLength", { length: 64 })
                            : t("application.alternateContact.type.otherTypeValidationErrorMessage")
                        }
                        register={register}
                        dataTestId={"app-alternate-other-type"}
                      />
                    )}
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
