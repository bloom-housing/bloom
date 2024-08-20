import React, { useContext, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { DOBField, Field, Form, t, emailRegex } from "@bloom-housing/ui-components"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
import { Alert, Icon } from "@bloom-housing/ui-seeds"
import {
  OnClientSide,
  PageView,
  pushGtmEvent,
  AuthContext,
  CustomIconMap,
} from "@bloom-housing/shared-helpers"
import FormsLayout from "../../../layouts/forms"
import { useFormConductor } from "../../../lib/hooks"
import { UserStatus } from "../../../lib/constants"
import ApplicationFormLayout from "../../../layouts/application-form"
import styles from "../../../layouts/application-form.module.scss"

const ApplicationName = () => {
  const { profile } = useContext(AuthContext)
  const { conductor, application, listing } = useFormConductor("primaryApplicantName")
  const [autofilled, setAutofilled] = useState(false)

  const currentPageSection = 1

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, watch, errors, trigger } = useForm<Record<string, any>>({
    shouldFocusError: false,
    defaultValues: {
      "applicant.emailAddress": application.applicant.emailAddress,
      "applicant.noEmail": application.applicant.noEmail,
    },
  })
  const onSubmit = async (data) => {
    const validation = await trigger()
    if (!validation) return

    if (!autofilled) {
      conductor.currentStep.save({ applicant: { ...application.applicant, ...data.applicant } })
    }
    conductor.routeToNextOrReturnUrl()
  }
  const onError = () => {
    window.scrollTo(0, 0)
  }

  const emailPresent: string = watch("applicant.emailAddress")
  const noEmail: boolean = watch("applicant.noEmail")
  const clientLoaded = OnClientSide()
  if (!autofilled && clientLoaded && application.autofilled) setAutofilled(true)

  const LockIcon = () => {
    return (
      autofilled && (
        <Icon className="ml-2 text-primary" size="md">
          {CustomIconMap.lockClosed}
        </Icon>
      )
    )
  }

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Application - Contact Name",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  return (
    <FormsLayout>
      <Form onSubmit={handleSubmit(onSubmit, onError)}>
        <ApplicationFormLayout
          listingName={listing?.name}
          heading={t("application.name.title")}
          progressNavProps={{
            currentPageSection: currentPageSection,
            completedSections: application.completedSections,
            labels: conductor.config.sections.map((label) => t(`t.${label}`)),
            mounted: OnClientSide(),
          }}
          backLink={{
            url: autofilled ? `/applications/start/autofill` : `/applications/start/what-to-expect`,
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
          <CardSection divider={"inset"}>
            <div id={"application-initial-page"}>
              <fieldset>
                <legend
                  className={`text__caps-spaced ${errors.applicant?.firstName ? "text-alert" : ""}`}
                >
                  {t("application.name.yourName")}
                  <LockIcon />
                </legend>

                <Field
                  name="applicant.firstName"
                  label={t("application.name.firstOrGivenName")}
                  disabled={autofilled}
                  defaultValue={application.applicant.firstName}
                  validation={{ required: true, maxLength: 64 }}
                  error={errors.applicant?.firstName}
                  errorMessage={
                    errors.applicant?.firstName?.type === "maxLength"
                      ? t("errors.maxLength", { length: 64 })
                      : t("errors.givenNameError")
                  }
                  register={register}
                  dataTestId={"app-primary-first-name"}
                />

                <Field
                  name="applicant.middleName"
                  label={t("application.name.middleNameOptional")}
                  disabled={autofilled}
                  defaultValue={application.applicant.middleName}
                  register={register}
                  dataTestId={"app-primary-middle-name"}
                  validation={{ maxLength: 64 }}
                  error={errors.applicant?.middleName}
                  errorMessage={t("errors.maxLength", { length: 64 })}
                />

                <Field
                  name="applicant.lastName"
                  label={t("application.name.lastOrFamilyName")}
                  disabled={autofilled}
                  defaultValue={application.applicant.lastName}
                  validation={{ required: true, maxLength: 64 }}
                  error={errors.applicant?.lastName}
                  errorMessage={
                    errors.applicant?.lastName?.type === "maxLength"
                      ? t("errors.maxLength", { length: 64 })
                      : t("errors.familyNameError")
                  }
                  register={register}
                  dataTestId={"app-primary-last-name"}
                />
              </fieldset>
            </div>
          </CardSection>
          <CardSection divider={"inset"}>
            <DOBField
              defaultDOB={{
                birthDay: application.applicant.birthDay,
                birthMonth: application.applicant.birthMonth,
                birthYear: application.applicant.birthYear,
              }}
              disabled={autofilled}
              register={register}
              required={true}
              error={errors.applicant}
              name="applicant"
              id="applicant.dateOfBirth"
              watch={watch}
              validateAge18={true}
              errorMessage={t("errors.dateOfBirthErrorAge")}
              label={
                <>
                  {t("application.name.yourDateOfBirth")}
                  <LockIcon />
                </>
              }
            />
            <p className={"field-sub-note"}>{t("application.name.dobHelper")}</p>
          </CardSection>
          <CardSection divider={"flush"} className={"border-none"}>
            <legend
              className={`text__caps-spaced ${errors.applicant?.emailAddress ? "text-alert" : ""}`}
            >
              {t("application.name.yourEmailAddress")}
              <LockIcon />
            </legend>

            <p className="field-note mb-4">{t("application.name.emailPrivacy")}</p>

            <Field
              type="email"
              name="applicant.emailAddress"
              label={t("application.name.yourEmailAddress")}
              readerOnly={true}
              defaultValue={application.applicant.emailAddress}
              validation={{ required: !noEmail, pattern: emailRegex }}
              error={errors.applicant?.emailAddress}
              errorMessage={t("errors.emailAddressError")}
              register={register}
              disabled={clientLoaded && (noEmail || autofilled)}
              dataTestId={"app-primary-email"}
              subNote={"example@mail.com"}
            />

            <Field
              type="checkbox"
              id="noEmail"
              name="applicant.noEmail"
              label={t("application.name.noEmailAddress")}
              primary={true}
              register={register}
              disabled={clientLoaded && (emailPresent?.length > 0 || autofilled)}
              inputProps={{
                defaultChecked: clientLoaded && noEmail,
              }}
              dataTestId={"app-primary-no-email"}
            />
          </CardSection>
        </ApplicationFormLayout>
      </Form>
    </FormsLayout>
  )
}

export default ApplicationName
