/*
2.2 - Add Members
Add household members
*/
import Link from "next/link"
import Router from "next/router"
import { Button, FormCard, HouseholdMemberForm, ProgressNav, t } from "@bloom-housing/ui-components"
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
  const { handleSubmit } = useForm()
  const onSubmit = (data) => {
    application.householdSize = application.householdMembers.length + 1
    conductor.sync()
    console.log(data)
    Router.push("/applications/household/preferred-units").then(() => window.scrollTo(0, 0))
  }

  const onAddMember = () => {
    Router.push({
      pathname: "/applications/household/member",
      query: { memberId: null },
    }).then(() => window.scrollTo(0, 0))
  }

  const applicant = application.applicant

  const membersSection = application.householdMembers.map((member, key) => {
    return (
      <HouseholdMemberForm
        member={member}
        key={"member" + key}
        type={t("application.household.householdMember")}
      />
    )
  })

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
            <Link href="/applications/household/members-info">{t("t.back")}</Link>
          </strong>
        </p>
        <div className="form-card__lead border-b">
          <h2 className="form-card__title is-borderless mt-4">
            {t("application.household.addMembers.title")}
          </h2>
        </div>

        <div className="form-card__pager-row">
          <form onSubmit={handleSubmit(onSubmit)}>
            <HouseholdMemberForm
              member={applicant}
              type={t("application.household.primaryApplicant")}
            />
            {membersSection}
          </form>
          <div className="text-center py-4">
            <Button onClick={onAddMember}>
              {t("application.household.addMembers.addHouseholdMember")}
            </Button>
          </div>
        </div>
        <div className="form-card__pager">
          <div className="form-card__pager-row primary">
            <Button filled={true} className="" onClick={onSubmit}>
              {t("application.household.addMembers.done")}
            </Button>
          </div>
        </div>
      </FormCard>
    </FormsLayout>
  )
}
