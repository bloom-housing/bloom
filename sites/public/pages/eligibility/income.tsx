/*
Income
Prompts the user for their annual income.
*/
import React, { useContext } from "react"
import { t } from "@bloom-housing/ui-components/src/helpers/translator"
import { FieldGroup } from "@bloom-housing/ui-components"
import { FieldValues, useForm } from "react-hook-form"
import { EligibilityContext } from "../../lib/EligibilityContext"
import EligibilityLayout from "../../layouts/eligibility"
import style from "./EligibilityIncome.module.scss"

const EligibilityIncome = () => {
  const { eligibilityRequirements } = useContext(EligibilityContext)

  const incomeRanges = ["below10k", "10kTo20k", "30kTo40k", "40kTo50k", "over50k"]
  const CURRENT_PAGE = 5

  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const formMethods = useForm({
    defaultValues: {
      income: eligibilityRequirements?.income ?? incomeRanges[0],
    } as FieldValues,
  })
  const onSubmitIncome = (data) => {
    eligibilityRequirements.setIncome(data.income)
  }

  if (eligibilityRequirements.completedSections <= CURRENT_PAGE) {
    eligibilityRequirements.setCompletedSections(CURRENT_PAGE + 1)
  }

  return (
    <EligibilityLayout
      title={t("eligibility.income.prompt")}
      currentPage={5}
      formMethods={formMethods}
      onFinishStep={onSubmitIncome}
    >
      <div className="form-card__group px-0 mx-0">
        <p className="mb-4" id="income-description">
          {t("eligibility.income.description")}
        </p>
        <ul className={`${style.wage_types} field-note`}>
          <li>{t("eligibility.income.examples.wages")}</li>
          <li>{t("eligibility.income.examples.socialSecurity")}</li>
          <li>{t("eligibility.income.examples.retirement")}</li>
          <li>{t("eligibility.income.examples.unemployment")}</li>
        </ul>
        <FieldGroup
          name="income"
          type="radio"
          // eslint-disable-next-line @typescript-eslint/unbound-method
          register={formMethods.register}
          fields={incomeRanges.map((key) => {
            return {
              label: t(`eligibility.income.ranges.${key}`),
              value: key,
              id: key,
              defaultChecked: eligibilityRequirements?.income === key,
            }
          })}
        />
        <div className="p-4 bg-gray-400 rounded-2xl">{t("eligibility.disclaimer.description")}</div>
      </div>
    </EligibilityLayout>
  )
}

export default EligibilityIncome
