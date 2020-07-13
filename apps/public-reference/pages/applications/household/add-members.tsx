/*
2.2 - Add Members
Add household members
*/
import Link from "next/link"
import Router from "next/router"
import {
  Button,
  FormCard,
  HouseholdMemberForm,
  ProgressNav,
  t,
  ErrorMessage,
} from "@bloom-housing/ui-components"
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
  application.householdSize = application.householdMembers.length + 1

  /* Form Handler */
  const { errors, handleSubmit, register } = useForm()
  const onSubmit = (data) => {
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
  console.log(listing)

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
            {listing && (
              <>
                <span className="hidden">
                  <input
                    className="invisible"
                    type="number"
                    id="householdSize"
                    name="householdSize"
                    defaultValue={application.householdSize}
                    ref={register({
                      min: {
                        value: listing.householdSizeMin,
                        message: t("application.form.errors.householdTooSmall"),
                      },
                      max: {
                        value: listing.householdSizeMax,
                        message: t("application.form.errors.householdTooBig"),
                      },
                    })}
                  />
                </span>
                <ErrorMessage error={errors.householdSize}>
                  <p className="text-sm font-semibold">
                    {t("application.household.dontQualifyHeader")}
                  </p>
                  <p className="text-sm">{errors.householdSize?.message}</p>
                  <p className="text-sm mb-8">{t("application.household.dontQualifyInfo")}</p>
                </ErrorMessage>
              </>
            )}
            <HouseholdMemberForm
              member={applicant}
              type={t("application.household.primaryApplicant")}
            />
            {membersSection}
          </form>
          <div className="text-center">
            <Button onClick={onAddMember}>
              {t("application.household.addMembers.addHouseholdMember")}
            </Button>
          </div>
        </div>
        <div className="form-card__pager">
          <div className="form-card__pager-row primary">
            <Button filled={true} className="w-full md:w-3/4" onClick={handleSubmit(onSubmit)}>
              {t("application.household.addMembers.done")}
            </Button>
          </div>
        </div>
      </FormCard>
    </FormsLayout>
  )
}
