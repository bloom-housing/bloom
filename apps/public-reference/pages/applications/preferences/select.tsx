/*
4.1 Preferences Introduction
Instructions on how preferences work and their value
*/
import { useContext, useState } from "react"
import { useForm } from "react-hook-form"
import Link from "next/link"
import { Button, ErrorMessage, FormCard, ProgressNav, t } from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import { AppSubmissionContext } from "../../../lib/AppSubmissionContext"
import FormStep from "../../../src/forms/applications/FormStep"

export default () => {
  const [showMore, setShowMore] = useState({})
  const { conductor, application, listing } = useContext(AppSubmissionContext)
  const currentPageStep = 4

  const preferenceOptions = ["liveIn", "workIn"]

  const toggleShowMoreForOption = (option) =>
    setShowMore({ ...showMore, [option]: !showMore[option] })

  /* Form Handler */
  const { getValues, register, handleSubmit, errors, setValue, trigger } = useForm()
  const onSubmit = (data) => {
    new FormStep(conductor).save({ preferences: data })
    if (data.none) {
      conductor.routeToNextOrReturnUrl("/applications/preferences/general")
    } else {
      conductor.completeStep(4)
      conductor.sync()
      conductor.routeToNextOrReturnUrl("/applications/review/demographics")
    }
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
          <div className="form-card__group px-0 pb-3">
            <p className="field-note">{t("application.preferences.selectBelow")}</p>
          </div>

          {preferenceOptions.map((option) => (
            <div key={option} className="form-card__group px-0 border-b">
              <div className={"field " + (errors.none ? "error" : "")}>
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

              <p className="ml-8 -mt-3">
                <button
                  type="button"
                  className="button is-unstyled m-0 no-underline has-toggle"
                  aria-expanded={showMore[option] ? "true" : "false"}
                  onClick={() => {
                    toggleShowMoreForOption(option)
                  }}
                >
                  {t(showMore[option] ? "label.readLess" : "label.readMore")}
                </button>
              </p>

              {showMore[option] && (
                <p className="field-note mt-6 ml-8">
                  {t(`application.preferences.${option}.description`)}
                  <br />
                  <a
                    className="block pt-2"
                    href={t(`application.preferences.${option}.link`)}
                    target="_blank"
                  >
                    Link
                  </a>
                </p>
              )}
            </div>
          ))}

          <div className="form-card__group px-0">
            <div className={"field " + (errors.none ? "error" : "")}>
              <input
                type="checkbox"
                id="none"
                name="none"
                defaultChecked={application.preferences.none}
                ref={register({
                  validate: {
                    somethingIsChecked: (value) => {
                      return value || preferenceOptions.some((option) => getValues(option))
                    },
                  },
                })}
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

              <p className={"ml-8 field-note " + (errors.none ? "mb-5" : "")}>
                {t("application.preferences.stillHaveOpportunity")}
              </p>

              <ErrorMessage error={errors.none}>
                {t("application.form.errors.selectOption")}
              </ErrorMessage>
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
