/*
2.1 - Live Alone
Asks whether the applicant will be adding any additional household members
*/
import Link from "next/link"
import Router from "next/router"
import { Button, FormCard, ProgressNav, t, HouseholdSizeField } from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import { useForm } from "react-hook-form"
import { AppSubmissionContext } from "../../../lib/AppSubmissionContext"
import ApplicationConductor from "../../../lib/ApplicationConductor"
import { useContext, useState } from "react"

let nextPageUrl
export default () => {
  const [validateHousehold, setValidateHousehold] = useState(true)
  const context = useContext(AppSubmissionContext)
  const { application, listing } = context
  const conductor = new ApplicationConductor(application, listing, context)
  const currentPageStep = 2

  /* Form Handler */
  const { handleSubmit, register, errors, clearError } = useForm()
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

        <form className="mb-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <HouseholdSizeField
              listing={listing}
              householdSize={application.householdSize}
              validate={validateHousehold}
              register={register}
              error={errors.householdSize}
              clearError={clearError}
              assistanceUrl={t("application.household.assistanceUrl")}
            />
          </div>

          <div className="form-card__pager">
            <div className="form-card__pager-row">
              <Button
                big={true}
                className="w-full md:w-3/4"
                onClick={() => {
                  nextPageUrl = "/applications/household/preferred-units"
                  application.householdSize = 1
                  application.householdMembers = []
                  setValidateHousehold(true)
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
                  setValidateHousehold(false)
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
