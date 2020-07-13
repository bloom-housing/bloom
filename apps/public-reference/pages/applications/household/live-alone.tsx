/*
2.1 - Live Alone
Asks whether the applicant will be adding any additional household members
*/
import Link from "next/link"
import Router from "next/router"
import { Button, FormCard, ProgressNav, t, Field } from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import { useForm } from "react-hook-form"
import { AppSubmissionContext } from "../../../lib/AppSubmissionContext"
import ApplicationConductor from "../../../lib/ApplicationConductor"
import { useContext } from "react"

export default () => {
  const context = useContext(AppSubmissionContext)
  const { application, listing } = context
  const conductor = new ApplicationConductor(application, listing, context)
  const currentPageStep = 2
  let nextPageUrl, validateHousehold

  /* Form Handler */
  const { handleSubmit, register, errors } = useForm()
  const onSubmit = () => {
    conductor.sync()

    Router.push(nextPageUrl).then(() => window.scrollTo(0, 0))
  }

  const backUrl =
    application.alternateContact.type == "noContact"
      ? "/applications/contact/alternate-contact-type"
      : "/applications/contact/alternate-contact-contact"

  return (
    <FormsLayout>
      <FormCard header="LISTING">
        <ProgressNav
          currentPageStep={currentPageStep}
          completedSteps={application.completedStep}
          totalNumberOfSteps={conductor.totalNumberOfSteps()}
          labels={["You", "Household", "Income", "Preferences", "Review"]}
        />
      </FormCard>

      <FormCard>
        <p className="form-card__back">
          <strong>
            <Link href={backUrl}>{t("t.back")}</Link>
          </strong>
        </p>
        <div className="form-card__lead border-b">
          <h2 className="form-card__title is-borderless">
            {t("application.household.liveAlone.title")}
          </h2>
        </div>

        <form className="my-4" onSubmit={handleSubmit(onSubmit)}>
          {listing && validateHousehold && (
            <Field
              name="householdSize"
              defaultValue={application.householdSize}
              error={errors.householdSize}
              errorMessage={t("application.name.emailAddressError")}
              type="number"
              validation={{
                min: {
                  value: 2,
                  message: " MIN error message",
                },
                max: {
                  value: 3,
                  message: "Max error message",
                },
                required: true,
                validate: {
                  householdSizeRange: (value) => parseInt(value) > 0 && parseInt(value) <= 0,
                },
              }}
              register={register}
            />
          )}

          <div className="form-card__pager">
            <div className="form-card__pager-row">
              <Button
                big={true}
                className="w-full md:w-3/4"
                onClick={() => {
                  nextPageUrl = "/applications/household/preferred-units"
                  validateHousehold = true
                }}
              >
                {t("application.household.liveAlone.willLiveAlone")}
              </Button>
            </div>
            <div className="form-card__pager-row">
              <Button
                big={true}
                className="w-full md:w-3/4"
                onClick={() => {
                  nextPageUrl = "/applications/household/members-info"
                  validateHousehold = false
                }}
              >
                {t("application.household.liveAlone.liveWithOtherPeople")}
              </Button>
            </div>
          </div>
        </form>
      </FormCard>
    </FormsLayout>
  )
}
