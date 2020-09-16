/*
4.3 General Pool
If all preferences are opted out the applicant is shown a screen confirming their placement in the General Pool
*/
import { useContext, useEffect } from "react"
import { useForm } from "react-hook-form"
import Link from "next/link"
import Router from "next/router"
import { Button, FormCard, ProgressNav, t, Form } from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import { AppSubmissionContext } from "../../../lib/AppSubmissionContext"
import FormBackLink from "../../../src/forms/applications/FormBackLink"

export default () => {
  const { conductor, application, listing } = useContext(AppSubmissionContext)
  const currentPageSection = 4

  conductor.stepTo("General Pool")

  useEffect(() => {
    if (!application.preferences.none) {
      // Only describe the General Pool if no preferences were selected
      // TODO: come up with a generic "skip" function for new page loads
      conductor.routeToNextOrReturnUrl()
    }
  }, [application])

  /* Form Handler */
  const { register, handleSubmit, errors } = useForm()
  const onSubmit = (data) => {
    conductor.completeSection(4)
    conductor.sync()
    conductor.routeToNextOrReturnUrl()
  }

  return (
    <FormsLayout>
      <FormCard header={listing?.name}>
        <ProgressNav
          currentPageSection={currentPageSection}
          completedSections={application.completedSections}
          labels={conductor.config.sections}
        />
      </FormCard>

      <FormCard>
        <FormBackLink conductor={conductor} />

        <div className="form-card__lead">
          <h2 className="form-card__title is-borderless">
            {t("application.preferences.general.title")}
          </h2>

          <p className="field-note mt-5">{t("application.preferences.general.preamble")}</p>
        </div>

        <Form onSubmit={handleSubmit(onSubmit)}>
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
