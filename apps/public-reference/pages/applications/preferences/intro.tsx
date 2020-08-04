/*
4.1 Preferences Introduction
Instructions on how preferences work and their value
*/
import Link from "next/link"
import Router from "next/router"
import { Button, FormCard, ProgressNav, t } from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import { useForm } from "react-hook-form"
import { AppSubmissionContext } from "../../../lib/AppSubmissionContext"
import ApplicationConductor from "../../../lib/ApplicationConductor"
import { useContext, useMemo } from "react"

export default () => {
  const { conductor, application, listing } = useContext(AppSubmissionContext)
  const currentPageStep = 4

  /* Form Handler */
  const { register, handleSubmit, errors } = useForm()
  const onSubmit = (data) => {
    console.log(data)

    Router.push("/applications/preferences/live-or-work").then(() => window.scrollTo(0, 0))
  }

  return (
    <FormsLayout>
      <FormCard header="LISTING">
        <ProgressNav
          currentPageStep={currentPageStep}
          completedSteps={application.completedStep}
          labels={["You", "Household", "Income", "Preferences", "Review"]}
        />
      </FormCard>

      <FormCard>
        <p className="form-card__back">
          <strong>
            <Link href="/applications/financial/income">
              <a>{t("t.back")}</a>
            </Link>
          </strong>
        </p>

        <div className="form-card__lead border-b">
          <h2 className="form-card__title is-borderless">
            Based on the addresses you entered, your household may qualify for the following lottery
            preferences.
          </h2>

          <p className="field-note mt-5">
            Just upload valid proof of where you live or work in [region] and get a higher ranking
            in the lottery.
          </p>
        </div>

        <form className="" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-card__group px-0 border-b">
            <p className="field-note mb-4">
              If you have one of these lottery preferences, select it below:
            </p>

            <div className="field">
              <input
                type="checkbox"
                id="liveWork"
                name="liveWork"
                defaultChecked={application.preferences.liveWork}
                ref={register}
                onChange={() => {
                  setTimeout(() => {
                    setValue("none", false)
                    trigger("none")
                  }, 1)
                }}
              />
              <label htmlFor="hearing" className="font-semibold">
                Live or work in [region] preference
              </label>
            </div>
          </div>

          <div className="form-card__group px-0">
            <div className="field">
              <input
                type="checkbox"
                id="liveWork"
                name="liveWork"
                defaultChecked={application.preferences.liveWork}
                ref={register}
                onChange={() => {
                  setTimeout(() => {
                    setValue("none", false)
                    trigger("none")
                  }, 1)
                }}
              />
              <label htmlFor="hearing" className="font-semibold">
                I don't want this lottery preference
              </label>

              <p className="ml-8 field-note">
                You'll still have the opportunity to claim other preferences.
              </p>
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
        </form>
      </FormCard>
    </FormsLayout>
  )
}
