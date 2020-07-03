/*
2.1 - Live Alone
Asks whether the applicant will be adding any additional household members
*/
import Link from "next/link"
import Router from "next/router"
import { Button, FormCard, ProgressNav, t } from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import { useForm } from "react-hook-form"
import { AppSubmissionContext } from "../../../lib/AppSubmissionContext"
import ApplicationConductor from "../../../lib/ApplicationConductor"
import { useContext } from "react"

export default () => {
  const context = useContext(AppSubmissionContext)
  const { application } = context
  const conductor = new ApplicationConductor(application, context)
  const currentPageStep = 2

  /* Form Handler */
  const { register, handleSubmit, errors } = useForm()
  const onSubmit = (data) => {
    conductor.sync()

    if (application.householdSize == 1) {
      Router.push("/applications/household/preferred-units").then(() => window.scrollTo(0, 0))
    } else {
      Router.push("/applications/household/members-info").then(() => window.scrollTo(0, 0))
    }
  }

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
            <Link href="/applications/contact/alternate">{t("t.back")}</Link>
          </strong>
        </p>
        <div className="form-card__lead border-b">
          <h2 className="form-card__title is-borderless">
            {t("application.household.liveAlone.title")}
          </h2>
        </div>

        <form className="my-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-card__pager">
            <div className="form-card__pager-row">
              <Button
                big={true}
                className="w-full md:w-3/4"
                onClick={() => {
                  application.householdSize = 1
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
                  application.householdSize = 0
                  application.householdMembers = []
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
