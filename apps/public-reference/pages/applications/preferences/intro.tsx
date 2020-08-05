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
import FormStep from "../../../src/forms/applications/FormStep"
import { useContext, useMemo } from "react"

export default () => {
  const { conductor, application, listing } = useContext(AppSubmissionContext)
  const currentPageStep = 4

  const preferenceOptions = ["liveOrWork"]

  /* Form Handler */
  const { register, handleSubmit, errors, setValue, trigger } = useForm()
  const onSubmit = (data) => {
    new FormStep(conductor).save({ preferences: data })
    conductor.routeToNextOrReturnUrl("/applications/preferences/live-or-work")
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
          <h2 className="form-card__title is-borderless">{t("application.preferences.title")}</h2>

          <p className="field-note mt-5">{t("application.preferences.preamble")}</p>
        </div>

        <form className="" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-card__group px-0 border-b">
            <p className="field-note mb-4">{t("application.preferences.selectBelow")}</p>

            {preferenceOptions.map((option) => (
              <div className="field">
                <input
                  type="checkbox"
                  id={option}
                  name={option}
                  defaultChecked={application.preferences[option]}
                  ref={register}
                  onChange={() => {
                    setTimeout(() => {
                      setValue("none", false)
                      trigger("none")
                    }, 1)
                  }}
                />
                <label htmlFor={option} className="font-semibold uppercase tracking-wider">
                  {t(`application.preferences.${option}.label`)}
                </label>
              </div>
            ))}
          </div>

          <div className="form-card__group px-0">
            <div className="field">
              <input
                type="checkbox"
                id="none"
                name="none"
                defaultChecked={application.preferences.none}
                ref={register}
                onChange={(e) => {
                  if (e.target.checked) {
                    setValue("none", true)
                    preferenceOptions.forEach((option) => {
                      setValue(option, false)
                    })
                    trigger("none")
                  }
                }}
              />
              <label htmlFor="none" className="font-semibold">
                {t("application.preferences.dontWant")}
              </label>

              <p className="ml-8 field-note">{t("application.preferences.stillHaveOpportunity")}</p>
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
