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
import { useContext, useMemo, useState } from "react"

let nextPageUrl
export default () => {
  const { conductor, application, listing } = useContext(AppSubmissionContext)
  const [validateHousehold, setValidateHousehold] = useState(true)
  const currentPageStep = 2

  /* Form Handler */
  const { handleSubmit, register, errors, clearErrors } = useForm()
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
      <FormCard header={listing?.name}>
        <ProgressNav
          currentPageStep={currentPageStep}
          completedSteps={application.completedStep}
          labels={["You", "Household", "Income", "Preferences", "Review"]}
        />
      </FormCard>

      <FormCard>
        <p className="form-card__back">
          <strong>
            <Link href={backUrl}>
              <a>{t("t.back")}</a>
            </Link>
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
              clearErrors={clearErrors}
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
