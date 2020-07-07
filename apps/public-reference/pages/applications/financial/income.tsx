/*
3.2 Income
Total pre-tax household income from all sources
*/
import Link from "next/link"
import Router from "next/router"
import { Button, FormCard, ProgressNav, t, Field, ErrorMessage } from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import { useForm } from "react-hook-form"
import { AppSubmissionContext } from "../../../lib/AppSubmissionContext"
import ApplicationConductor from "../../../lib/ApplicationConductor"
import { useContext } from "react"
import FormStep from "../../../src/forms/applications/FormStep"

export default () => {
  const context = useContext(AppSubmissionContext)
  const { application } = context
  const conductor = new ApplicationConductor(application, context)
  const currentPageStep = 3

  /* Form Handler */
  const { register, handleSubmit, errors } = useForm({
    defaultValues: {
      income: application.income,
      incomePeriod: application.incomePeriod,
    },
  })
  const onSubmit = (data) => {
    const { income, incomePeriod } = data
    const toSave = { income, incomePeriod }
    new FormStep(conductor).save(toSave)

    application.completedStep = 3
    conductor.sync()

    Router.push("/applications/preferences/intro").then(() => window.scrollTo(0, 0))
  }

  return (
    <FormsLayout>
      <FormCard>
        <h5 className="font-alt-sans text-center mb-5">LISTING</h5>

        <ProgressNav
          currentPageStep={currentPageStep}
          completedSteps={application.completedStep}
          totalNumberOfSteps={conductor.totalNumberOfSteps()}
          labels={["You", "Household", "Income", "Preferences", "Review"]}
        />
      </FormCard>

      <FormCard>
        <p className="text-bold">
          <strong>
            <Link href="/applications/financial/vouchers">Back</Link>
          </strong>
        </p>

        <h2 className="form-card__title is-borderless">
          {t("application.financial.income.title")}
        </h2>

        <div className="text-gray-700">
          <p className="py-4">{t("application.financial.income.instruction1")}</p>
        </div>

        <div className="text-gray-700">
          <p className="py-4">{t("application.financial.income.instruction2")}</p>
        </div>

        <hr />

        <form className="mt-10" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-card__group">
            <p className="mb-2">{t("application.financial.income.prompt")}</p>

            <Field
              id="income"
              name="income"
              type="number"
              placeholder={t("application.financial.income.placeholder")}
              validation={{ required: true, min: 0.01 }}
              error={errors.income}
              register={register}
              prepend="$"
              errorMessage={t("application.financial.income.incomeError")}
              inputProps={{ step: 0.01 }}
            />

            <div className={`field ${errors.incomePeriod ? "error" : ""}`}>
              <input
                type="radio"
                id="incomePeriodMonthly"
                name="incomePeriod"
                value="perMonth"
                ref={register({ required: true })}
              />
              <label htmlFor="incomePeriodMonthly">
                {t("application.financial.income.perMonth")}
              </label>

              <input
                type="radio"
                id="incomePeriodYearly"
                name="incomePeriod"
                value="perYear"
                ref={register({ required: true })}
              />
              <label htmlFor="incomePeriodYearly">
                {t("application.financial.income.perYear")}
              </label>

              <ErrorMessage error={errors.incomePeriod}>
                {t("application.financial.income.periodError")}
              </ErrorMessage>
            </div>
          </div>

          <div className="text-center mt-6">
            <Button
              filled={true}
              onClick={() => {
                //
              }}
            >
              Next
            </Button>
          </div>
        </form>
      </FormCard>
    </FormsLayout>
  )
}
