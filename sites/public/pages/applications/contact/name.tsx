/*
1.2 - Name
Primary applicant details. Name, DOB and Email Address
https://github.com/bloom-housing/bloom/issues/255
*/
import React from "react"
import {
  AppearanceStyleType,
  AlertBox,
  Button,
  DOBField,
  Field,
  Form,
  FormCard,
  OnClientSide,
  ProgressNav,
  t,
  emailRegex,
} from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import { useForm } from "react-hook-form"
import { useFormConductor } from "../../../lib/hooks"

export default () => {
  const { conductor, application, listing } = useFormConductor("primaryApplicantName")
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
    conductor.currentStep.save({ applicant: { ...application.applicant, ...data.applicant } })
    conductor.routeToNextOrReturnUrl()
  }
  const onError = () => {
    window.scrollTo(0, 0)
  }

  const emailPresent: string = watch("applicant.emailAddress")
  const noEmail: boolean = watch("applicant.noEmail")
  const clientLoaded = OnClientSide()

  return (
    <FormsLayout>
      <FormCard header={listing?.name}>
        <ProgressNav
          currentPageSection={currentPageSection}
          completedSections={application.completedSections}
          labels={conductor.config.sections.map((label) => t(`t.${label}`))}
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
          <div className="form-card__group border-b">
            <fieldset>
              <legend className="field-label--caps">{t("application.name.yourName")}</legend>

              <Field
                name="applicant.firstName"
                label={t("application.name.firstName")}
                placeholder={t("application.name.firstName")}
                readerOnly={true}
                defaultValue={application.applicant.firstName}
                validation={{ required: true }}
                error={errors.applicant?.firstName}
                errorMessage={t("errors.firstNameError")}
                register={register}
              />

              <Field
                name="applicant.middleName"
                label={t("application.name.middleNameOptional")}
                placeholder={t("application.name.middleNameOptional")}
                readerOnly={true}
                defaultValue={application.applicant.middleName}
                register={register}
              />

              <Field
                name="applicant.lastName"
                label={t("application.name.lastName")}
                placeholder={t("application.name.lastName")}
                readerOnly={true}
                defaultValue={application.applicant.lastName}
                validation={{ required: true }}
                error={errors.applicant?.lastName}
                errorMessage={t("errors.lastNameError")}
                register={register}
              />
            </fieldset>
          </div>

          <div className="form-card__group border-b">
            <DOBField
              applicant={application.applicant}
              register={register}
              required={true}
              error={errors.applicant}
              name="applicant"
              id="applicant.dateOfBirth"
              watch={watch}
              atAge={true}
              label={t("application.name.yourDateOfBirth")}
            />
          </div>

          <div className="form-card__group">
            <h3 className="field-label--caps">{t("application.name.yourEmailAddress")}</h3>

            <p className="field-note mb-4">{t("application.name.emailPrivacy")}</p>

            <Field
              type="email"
              name="applicant.emailAddress"
              placeholder={clientLoaded && noEmail ? t("t.none") : "example@web.com"}
              label={t("application.name.yourEmailAddress")}
              readerOnly={true}
              defaultValue={application.applicant.emailAddress}
              validation={{ required: !noEmail, pattern: !noEmail ? emailRegex : false }}
              error={errors.applicant?.emailAddress}
              errorMessage={t("errors.emailAddressError")}
              register={register}
              disabled={clientLoaded && noEmail}
            />

            <Field
              type="checkbox"
              id="noEmail"
              name="applicant.noEmail"
              label={t("application.name.noEmailAddress")}
              primary={true}
              register={register}
              disabled={clientLoaded && emailPresent?.length > 0}
              inputProps={{
                defaultChecked: clientLoaded && noEmail,
              }}
            />
          </div>

          <div className="form-card__pager">
            <div className="form-card__pager-row primary">
              <Button
                styleType={AppearanceStyleType.primary}
                onClick={() => {
                  conductor.returnToReview = false
                }}
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
