/*
3.1 Vouchers Subsidies
Question asks if anyone on the application receives a housing voucher or subsidy.
*/
import Link from "next/link"
import { useRouter } from "next/router"
import { Button, ErrorMessage, FormCard, ProgressNav, t } from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import { useForm } from "react-hook-form"
import { AppSubmissionContext } from "../../../lib/AppSubmissionContext"
import ApplicationConductor from "../../../lib/ApplicationConductor"
import { useContext } from "react"
import FormStep from "../../../src/forms/applications/FormStep"

export default () => {
  const context = useContext(AppSubmissionContext)
  const router = useRouter()
  const { application, listing } = context
  const conductor = new ApplicationConductor(application, listing, context)
  const currentPageStep = 3

  /* Form Handler */
  const { register, handleSubmit, errors } = useForm({
    defaultValues: { incomeVouchers: application.incomeVouchers?.toString() },
  })

  const onSubmit = (data) => {
    const { incomeVouchers } = data
    const toSave = { incomeVouchers: JSON.parse(incomeVouchers) }
    new FormStep(conductor).save(toSave)

    router.push("/applications/financial/income").then(() => window.scrollTo(0, 0))
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
            <Link href="/applications/reserved/units">Back</Link>
          </strong>
        </p>

        <div className="form-card__lead border-b">
          <h2 className="form-card__title is-borderless">
            {t("application.financial.vouchers.title")}
          </h2>

          <p className="field-note mb-4 mt-5">
            <strong>{t("application.financial.vouchers.housingVouchers.strong")}</strong>
            {` ${t("application.financial.vouchers.housingVouchers.text")}`}
          </p>

          <p className="field-note mb-4">
            <strong>{t("application.financial.vouchers.nonTaxableIncome.strong")}</strong>
            {` ${t("application.financial.vouchers.nonTaxableIncome.text")}`}
          </p>

          <p className="field-note">
            <strong>{t("application.financial.vouchers.rentalSubsidies.strong")}</strong>
            {` ${t("application.financial.vouchers.rentalSubsidies.text")}`}
          </p>
        </div>

        <form className="" onSubmit={handleSubmit(onSubmit)}>
          <div className={`form-card__group field text-lg ${errors.incomeVouchers ? "error" : ""}`}>
            <p className="field-note mb-4">{t("application.financial.vouchers.prompt")}</p>

            <div className="field">
              <input
                type="radio"
                id="incomeVouchersYes"
                name="incomeVouchers"
                value="true"
                ref={register({ required: true })}
              />

              <label htmlFor="incomeVouchersYes" className="font-semibold">
                {t("application.financial.vouchers.yes")}
              </label>
            </div>

            <div className="field">
              <input
                type="radio"
                id="incomeVouchersNo"
                name="incomeVouchers"
                value="false"
                ref={register({ required: true })}
              />

              <label htmlFor="incomeVouchersNo" className="font-semibold">
                {t("application.financial.vouchers.no")}
              </label>
            </div>

            <ErrorMessage error={errors.incomeVouchers}>
              {t("application.financial.vouchers.error")}
            </ErrorMessage>
          </div>

          <div className="form-card__pager">
            <div className="form-card__pager-row primary">
              <Button
                filled={true}
                onClick={() => {
                  // Do nothing - handled by React Hook Forms
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
