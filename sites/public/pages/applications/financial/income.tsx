/*
3.2 Income
Total pre-tax household income from all sources
*/
import React, { useState } from "react"
import {
  AppearanceStyleType,
  AlertBox,
  AlertNotice,
  Button,
  Field,
  FieldGroup,
  Form,
  FormCard,
  ProgressNav,
  t,
} from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import { useForm } from "react-hook-form"
import FormBackLink from "../../../src/forms/applications/FormBackLink"
import { useFormConductor } from "../../../lib/hooks"

type IncomeError = "low" | "high" | null
// type IncomePeriod = "perMonth" | "perYear"

// TODO: toggle this verification off at the jurisdiction level with a feature flag
// function verifyIncome(listing: Listing, income: number, period: IncomePeriod): IncomeError {
//   // Look through all the units on this listing to see what the absolute max/min income requirements are.
//   const [annualMin, annualMax, monthlyMin] = listing.property.units.reduce(
//     ([aMin, aMax, mMin], unit) => [
//       Math.min(aMin, parseFloat(unit.annualIncomeMin)),
//       Math.max(aMax, parseFloat(unit.annualIncomeMax)),
//       Math.min(mMin, parseFloat(unit.monthlyIncomeMin)),
//     ],
//     [Infinity, 0, Infinity]
//   )

//   // For now, transform the annual max into a monthly max (DB records for Units don't have this value)
//   const monthlyMax = annualMax / 12.0

//   const compareMin = period === "perMonth" ? monthlyMin : annualMin
//   const compareMax = period === "perMonth" ? monthlyMax : annualMax

//   if (income < compareMin) {
//     return "low"
//   } else if (income > compareMax) {
//     return "high"
//   }
//   return null
// }

const ApplicationIncome = () => {
  const { conductor, application, listing } = useFormConductor("income")
  const [incomeError, setIncomeError] = useState<IncomeError>(null)
  const currentPageSection = 3

  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, errors, getValues, setValue } = useForm({
    defaultValues: {
      income: application.income,
      incomePeriod: application.incomePeriod,
    },
    shouldFocusError: false,
  })

  const onSubmit = (data) => {
    const { income, incomePeriod } = data

    // TODO: toggle this verification off at the jurisdiction level with a feature flag
    // Skip validation of total income if the applicant has income vouchers.
    // const validationError = application.incomeVouchers
    //   ? null
    //   : verifyIncome(listing, income, incomePeriod)

    const validationError = null

    setIncomeError(validationError)

    if (!validationError) {
      const toSave = { income, incomePeriod }

      conductor.completeSection(3)
      conductor.currentStep.save(toSave)
      conductor.routeToNextOrReturnUrl()
    }
  }
  const onError = () => {
    window.scrollTo(0, 0)
  }

  const incomePeriodValues = [
    {
      id: "incomePeriodMonthly",
      value: "perMonth",
      label: t("t.perMonth"),
    },
    {
      id: "incomePeriodYearly",
      value: "perYear",
      label: t("t.perYear"),
    },
  ]

  return (
    <FormsLayout>
      <FormCard header={listing?.name}>
        <ProgressNav
          currentPageSection={currentPageSection}
          completedSections={application.completedSections}
          labels={conductor.config.sections.map((label) => t(`t.${label}`))}
        />
      </FormCard>

      <FormCard>
        <FormBackLink
          url={conductor.determinePreviousUrl()}
          onClick={() => conductor.setNavigatedBack(true)}
        />

        <div className="form-card__lead border-b">
          <h2 className="form-card__title is-borderless">
            {t("application.financial.income.title")}
          </h2>

          <p className="field-note mt-5 mb-4">{t("application.financial.income.instruction1")}</p>

          <p className="field-note">{t("application.financial.income.instruction2")}</p>
        </div>

        {Object.entries(errors).length > 0 && (
          <AlertBox type="alert" inverted closeable>
            {t("errors.errorsToResolve")}
          </AlertBox>
        )}

        {incomeError && (
          <>
            <AlertBox type="alert" inverted onClose={() => setIncomeError(null)}>
              {t("application.financial.income.validationError.title")}
            </AlertBox>
            <AlertNotice
              title={t(`application.financial.income.validationError.reason.${incomeError}`)}
              type="alert"
              inverted
            >
              <p className="mb-2">
                {t(`application.financial.income.validationError.instruction1`)}
              </p>
              <p className="mb-2">
                {t(`application.financial.income.validationError.instruction2`)}
              </p>
              <p>
                <a href="#">{t("nav.getAssistance")}</a>
              </p>
            </AlertNotice>
          </>
        )}

        <Form onSubmit={handleSubmit(onSubmit, onError)}>
          <div className="form-card__group">
            <Field
              id="income"
              name="income"
              type="currency"
              label={t("application.financial.income.prompt")}
              caps={true}
              placeholder={t("application.financial.income.placeholder")}
              validation={{ required: true, min: 0.01 }}
              error={errors.income}
              register={register}
              errorMessage={t("errors.numberError")}
              setValue={setValue}
              getValues={getValues}
              prepend={"$"}
            />

            <fieldset>
              <legend className="sr-only">{t("application.financial.income.legend")}</legend>
              <FieldGroup
                type="radio"
                name="incomePeriod"
                error={errors.incomePeriod}
                errorMessage={t("errors.selectOption")}
                register={register}
                validation={{ required: true }}
                fields={incomePeriodValues}
              />
            </fieldset>
          </div>

          <div className="form-card__pager">
            <div className="form-card__pager-row primary">
              <Button
                styleType={AppearanceStyleType.primary}
                onClick={() => {
                  conductor.returnToReview = false
                  conductor.setNavigatedBack(false)
                }}
              >
                {t("t.next")}
              </Button>
            </div>

            {conductor.canJumpForwardToReview() && (
              <div className="form-card__pager-row">
                <Button
                  unstyled={true}
                  className="mb-4"
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

export default ApplicationIncome
