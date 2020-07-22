/*
2.4.c ADA Household Members
If any, the applicant can select the type of ADA needed in the household.
https://github.com/bloom-housing/bloom/issues/266
*/
import Link from "next/link"
import Router from "next/router"
import { Button, ErrorMessage, FormCard, ProgressNav, t } from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import { useForm } from "react-hook-form"
import { AppSubmissionContext } from "../../../lib/AppSubmissionContext"
import ApplicationConductor from "../../../lib/ApplicationConductor"
import FormStep from "../../../src/forms/applications/FormStep"
import { useContext } from "react"

export default () => {
  const context = useContext(AppSubmissionContext)
  const { application, listing } = context
  const conductor = new ApplicationConductor(application, listing, context)
  const currentPageStep = 2

  /* Form Handler */
  const { register, handleSubmit, getValues, setValue, trigger, watch, errors } = useForm<
    Record<string, any>
  >({
    defaultValues: {
      none:
        application.accessibility.mobility === false &&
        application.accessibility.vision === false &&
        application.accessibility.hearing === false,
    },
  })
  const onSubmit = (data) => {
    new FormStep(conductor).save({
      accessibility: {
        mobility: data.mobility,
        vision: data.vision,
        hearing: data.hearing,
      },
    })

    Router.push("/applications/reserved/units").then(() => window.scrollTo(0, 0))
  }

  const adaNone = watch("none")

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
            <Link href="/applications/household/current">Back</Link>
          </strong>
        </p>

        <div className="form-card__lead border-b">
          <h2 className="form-card__title is-borderless">{t("application.ada.title")}</h2>

          <p className="field-note mt-5">{t("application.ada.subTitle")}</p>
        </div>

        <div className="form-card__group">
          <p className="field-note mb-4">{t("t.selectAllThatApply")}</p>

          <div className="field">
            <input
              type="checkbox"
              id="mobility"
              name="mobility"
              defaultChecked={application.accessibility.mobility}
              ref={register}
              onChange={() => {
                setTimeout(() => {
                  setValue("none", false)
                  trigger("none")
                }, 1)
              }}
            />
            <label htmlFor="mobility" className="font-semibold">
              For Mobility Impairments
            </label>
          </div>

          <div className="field">
            <input
              type="checkbox"
              id="vision"
              name="vision"
              defaultChecked={application.accessibility.vision}
              ref={register}
              onChange={() => {
                setTimeout(() => {
                  setValue("none", false)
                  trigger("none")
                }, 1)
              }}
            />
            <label htmlFor="vision" className="font-semibold">
              For Vision Impairments
            </label>
          </div>

          <div className="field">
            <input
              type="checkbox"
              id="hearing"
              name="hearing"
              defaultChecked={application.accessibility.hearing}
              ref={register}
              onChange={() => {
                setTimeout(() => {
                  setValue("none", false)
                  trigger("none")
                }, 1)
              }}
            />
            <label htmlFor="hearing" className="font-semibold">
              For Hearing Impairments
            </label>
          </div>

          <div className={"field " + (errors.none ? "error" : "")}>
            <input
              type="checkbox"
              id="none"
              name="none"
              ref={register({
                validate: {
                  somethingIsChecked: (value) =>
                    value || getValues("mobility") || getValues("vision") || getValues("hearing"),
                },
              })}
              onChange={(e) => {
                if (e.target.checked) {
                  setValue("none", true)
                  setValue("mobility", false)
                  setValue("vision", false)
                  setValue("hearing", false)
                  trigger("none")
                }
              }}
            />
            <label htmlFor="none" className="font-semibold">
              {t("t.no")}
            </label>

            <ErrorMessage error={errors.none}>
              {t("application.form.errors.selectOption")}
            </ErrorMessage>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-card__pager">
            <div className="form-card__pager-row primary">
              <Button
                filled={true}
                onClick={() => {
                  //
                }}
              >
                Next
              </Button>
            </div>
          </div>
        </form>
      </FormCard>
    </FormsLayout>
  )
}
