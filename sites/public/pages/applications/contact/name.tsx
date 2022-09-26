/*
1.2 - Name
Primary applicant details. Name, DOB and Email Address
https://github.com/bloom-housing/bloom/issues/255
*/
import React, { useContext, useEffect, useState } from "react"
import {
  AppearanceStyleType,
  AlertBox,
  Button,
  DOBField,
  Field,
  Form,
  FormCard,
  Icon,
  IconFillColors,
  t,
  ProgressNav,
  emailRegex,
} from "@bloom-housing/ui-components"
import { OnClientSide, PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import FormsLayout from "../../../layouts/forms"
import { useForm } from "react-hook-form"
import { useFormConductor } from "../../../lib/hooks"
import { UserStatus } from "../../../lib/constants"

const ApplicationName = () => {
  const { profile } = useContext(AuthContext)
  const { conductor, application, listing } = useFormConductor("primaryApplicantName")
  const [autofilled, setAutofilled] = useState(false)

  const currentPageSection = 1

  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, watch, errors } = useForm<Record<string, any>>({
    shouldFocusError: false,
    defaultValues: {
      "applicant.emailAddress": application.applicant.emailAddress,
      "applicant.noEmail": application.applicant.noEmail,
    },
  })
  const onSubmit = (data) => {
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
        <Icon className="ml-2" size="medium" symbol="lock" fill={IconFillColors.primary} />
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
      <FormCard
        header={{
          isVisible: true,
          title: listing?.name,
        }}
      >
        <ProgressNav
          currentPageSection={currentPageSection}
          completedSections={application.completedSections}
          labels={conductor.config.sections.map((label) => t(`t.${label}`))}
          mounted={OnClientSide()}
        />
      </FormCard>
      <FormCard>
        <div className="form-card__lead border-b">
          <h2 className="form-card__title is-borderless">{t("application.name.title")}</h2>
        </div>

        {Object.entries(errors).length > 0 && (
          <AlertBox type="alert" inverted closeable>
            {t("errors.errorsToResolve")}
          </AlertBox>
        )}

        <Form onSubmit={handleSubmit(onSubmit, onError)}>
          <div className="form-card__group border-b" data-test-id={"application-initial-page"}>
            <fieldset>
              <legend
                className={`field-label--caps ${errors.applicant?.firstName ? "text-alert" : ""}`}
              >
                {t("application.name.yourName")}
                <LockIcon />
              </legend>

              <Field
                name="applicant.firstName"
                label={t("application.name.firstName")}
                placeholder={t("application.name.firstName")}
                readerOnly={true}
                disabled={autofilled}
                defaultValue={application.applicant.firstName}
                validation={{ required: true }}
                error={errors.applicant?.firstName}
                errorMessage={t("errors.firstNameError")}
                register={register}
                dataTestId={"app-primary-first-name"}
              />

              <Field
                name="applicant.middleName"
                label={t("application.name.middleNameOptional")}
                placeholder={t("application.name.middleNameOptional")}
                disabled={autofilled}
                readerOnly={true}
                defaultValue={application.applicant.middleName}
                register={register}
                dataTestId={"app-primary-middle-name"}
              />

              <Field
                name="applicant.lastName"
                label={t("application.name.lastName")}
                placeholder={t("application.name.lastName")}
                disabled={autofilled}
                readerOnly={true}
                defaultValue={application.applicant.lastName}
                validation={{ required: true }}
                error={errors.applicant?.lastName}
                errorMessage={t("errors.lastNameError")}
                register={register}
                dataTestId={"app-primary-last-name"}
              />
            </fieldset>
          </div>

          <div className="form-card__group border-b">
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
          </div>

          <div className="form-card__group">
            <legend
              className={`field-label--caps ${errors.applicant?.emailAddress ? "text-alert" : ""}`}
            >
              {t("application.name.yourEmailAddress")}
              <LockIcon />
            </legend>

            <p className="field-note mb-4">{t("application.name.emailPrivacy")}</p>

            <Field
              type="email"
              name="applicant.emailAddress"
              placeholder={clientLoaded && noEmail ? t("t.none") : "example@web.com"}
              label={t("application.name.yourEmailAddress")}
              readerOnly={true}
              defaultValue={application.applicant.emailAddress}
              validation={{ required: !noEmail, pattern: emailRegex }}
              error={errors.applicant?.emailAddress}
              errorMessage={t("errors.emailAddressError")}
              register={register}
              disabled={clientLoaded && (noEmail || autofilled)}
              dataTestId={"app-primary-email"}
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
          </div>

          <div className="form-card__pager">
            <div className="form-card__pager-row primary">
              <Button
                styleType={AppearanceStyleType.primary}
                onClick={() => {
                  conductor.returnToReview = false
                  conductor.setNavigatedBack(false)
                }}
                data-test-id={"app-next-step-button"}
              >
                {t("t.next")}
              </Button>
            </div>

            {conductor.canJumpForwardToReview() && (
              <div className="form-card__pager-row">
                <Button
                  unstyled={true}
                  className="mb-4"
                  onClick={() => {
                    conductor.returnToReview = true
                  }}
                >
                  {t("application.form.general.saveAndReturn")}
                </Button>
              </div>
            )}
          </div>
        </Form>
      </FormCard>
    </FormsLayout>
  )
}

export default ApplicationName
