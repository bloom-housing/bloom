/*
5.2 Summary
Display a summary of application fields with edit links per section
*/
import Link from "next/link"
import Router from "next/router"
import { Button, FormCard, ProgressNav, t, Form } from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import { useForm } from "react-hook-form"
import { AppSubmissionContext } from "../../../lib/AppSubmissionContext"
import { useContext } from "react"
import FormSummaryDetails from "../../../src/forms/applications/FormSummaryDetails"

export default () => {
  const { listing, application } = useContext(AppSubmissionContext)
  const currentPageStep = 5

  /* Form Handler */
  const { handleSubmit } = useForm()
  const onSubmit = (data) => {
    console.log(data)

    Router.push("/applications/review/terms").then(() => window.scrollTo(0, 0))
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
        <div className="form-card__lead">
          <h2 className="form-card__title is-borderless">
            {t("application.review.takeAMomentToReview")}
          </h2>
        </div>

        <FormSummaryDetails application={application} editMode />

        <div className="form-card__group">
          <p className="field-note text-gray-800 text-center">
            {t("application.review.lastChanceToEdit")}
          </p>
        </div>

        <div className="form-card__pager">
          <div className="form-card__pager-row primary">
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Button
                filled={true}
                onClick={() => {
                  //
                }}
              >
                {t("t.confirm")}
              </Button>
            </Form>
          </div>
        </div>
      </FormCard>
    </FormsLayout>
  )
}
