/*
1.2 - Name
Primary applicant details. Name, DOB and Email Address
https://github.com/bloom-housing/bloom/issues/255
*/
import {
  AlertBox,
  Button,
  DOBField,
  Field,
  Form,
  FormCard,
  OnClientSide,
  ProgressNav,
  t,
} from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import { useForm } from "react-hook-form"
import { AppSubmissionContext } from "../../../lib/AppSubmissionContext"
import FormStep from "../../../src/forms/applications/FormStep"
import { useContext } from "react"
import { emailRegex } from "../../../lib/helpers"
import { useEffect } from "react"

export default () => {
  const { conductor, application, listing } = useContext(AppSubmissionContext)
  const currentPageStep = 1

  /* Form Handler */
  const { register, handleSubmit, setValue, watch, errors, clearErrors } = useForm<
    Record<string, any>
  >({
    shouldFocusError: false,
    defaultValues: {
      "applicant.emailAddress": application.applicant.emailAddress,
      "applicant.noEmail": application.applicant.noEmail,
    },
  })
  const onSubmit = (data) => {
    new FormStep(conductor).save({ applicant: { ...application.applicant, ...data.applicant } })
    conductor.routeToNextOrReturnUrl("/applications/contact/address")
  }
  const onError = () => {
    window.scrollTo(0, 0)
  }

  const emailPresent: string = watch("applicant.emailAddress")
  const noEmail: boolean = watch("applicant.noEmail")
  const clientLoaded = OnClientSide()

  {
    clientLoaded && console.info("noEmail!", noEmail, application.applicant.noEmail)
  }

  return (
    <FormsLayout>
      <FormCard header={listing?.name}>
        <ProgressNav
          currentPageStep={currentPageStep}
          completedSteps={application.completedStep}
          labels={["You", "Household", "Income", "Preferences", "Review"]}
        />
      </FormCard>

      <FormCard>
        <div className="form-card__lead border-b">
          <h2 className="form-card__title is-borderless">{t("application.name.title")}</h2>
        </div>

        {Object.entries(errors).length > 0 && (
          <AlertBox type="alert" inverted closeable>
            {t("t.errorsToResolve")}
          </AlertBox>
        )}

        <Form onSubmit={handleSubmit(onSubmit, onError)}>
          <div className="form-card__group border-b">
            <label className="field-label--caps" htmlFor="firstName">
              {t("application.name.yourName")}
            </label>

            <Field
              name="applicant.firstName"
              placeholder={t("application.name.firstName")}
              defaultValue={application.applicant.firstName}
              validation={{ required: true }}
              error={errors.applicant?.firstName}
              errorMessage={t("application.name.firstNameError")}
              register={register}
            />

            <Field
              name="applicant.middleName"
              placeholder={t("application.name.middleName")}
              defaultValue={application.applicant.middleName}
              register={register}
            />

            <Field
              name="applicant.lastName"
              placeholder={t("application.name.lastName")}
              defaultValue={application.applicant.lastName}
              validation={{ required: true }}
              error={errors.applicant?.lastName}
              errorMessage={t("application.name.lastNameError")}
              register={register}
            />
          </div>

          <div className="form-card__group border-b">
            <DOBField
              applicant={application.applicant}
              register={register}
              error={errors.applicant}
              name="applicant"
              watch={watch}
              atAge={true}
              label={t("application.name.yourDateOfBirth")}
            />
          </div>

          <div className="form-card__group">
            <label className="field-label--caps" htmlFor="emailAddress">
              {t("application.name.yourEmailAddress")}
            </label>

            <p className="field-note mb-4">{t("application.name.emailPrivacy")}</p>

            <Field
              type="email"
              name="applicant.emailAddress"
              placeholder={clientLoaded && noEmail ? t("t.none") : "example@web.com"}
              defaultValue={application.applicant.emailAddress}
              validation={{ required: !noEmail, pattern: !noEmail ? emailRegex : false }}
              error={errors.applicant?.emailAddress}
              errorMessage={t("application.name.emailAddressError")}
              register={register}
              disabled={clientLoaded && noEmail}
            />

            <div className="field">
              <input
                type="checkbox"
                id="noEmail"
                name="applicant.noEmail"
                defaultChecked={clientLoaded && noEmail}
                disabled={clientLoaded && emailPresent?.length > 0}
                ref={register}
              />
              <label htmlFor="noEmail" className="text-primary font-semibold">
                {t("application.name.noEmailAddress")}
              </label>
            </div>
          </div>

          <div className="form-card__pager">
            <div className="form-card__pager-row primary">
              <Button
                filled={true}
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
                  className="button is-unstyled mb-4"
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
