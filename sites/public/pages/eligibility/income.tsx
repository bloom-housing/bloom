/*
Income
Prompts the user for their annual income.
*/
import React, { useContext } from "react"
import { FormCard } from "@bloom-housing/ui-components/src/blocks/FormCard"
import { t } from "@bloom-housing/ui-components/src/helpers/translator"
import { ELIGIBILITY_DISCLAIMER_ROUTE } from "../../lib/constants"
import { Form } from "@bloom-housing/ui-components/src/forms/Form"
import { Button } from "@bloom-housing/ui-components/src/actions/Button"
import { AppearanceStyleType, FieldGroup } from "@bloom-housing/ui-components"
import { useForm } from "react-hook-form"
import { EligibilityContext } from "../../lib/EligibilityContext"
import { eligibilityRoute } from "../../lib/helpers"
import FormBackLink from "../../src/forms/applications/FormBackLink"
import { useRouter } from "next/router"
import EligibilityLayout from "../../layouts/eligibility"
import style from "./EligibilityIncome.module.scss"

const EligibilityIncome = () => {
  const router = useRouter()
  const { eligibilityRequirements } = useContext(EligibilityContext)

  const incomeRanges = ["below10k", "10kTo20k", "30kTo40k", "40kTo50k", "over50k"]
  const CURRENT_PAGE = 5

  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { handleSubmit, register } = useForm({
    defaultValues: {
      income: eligibilityRequirements?.income ?? incomeRanges[0],
    },
  })
  const onSubmit = async (data) => {
    eligibilityRequirements.setIncome(data.income)
    await router.push(ELIGIBILITY_DISCLAIMER_ROUTE)
  }

  if (eligibilityRequirements.completedSections <= CURRENT_PAGE) {
    eligibilityRequirements.setCompletedSections(CURRENT_PAGE + 1)
  }

  return (
    <FormsLayout>
      <FormCard header={t("eligibility.progress.header")}>
        <ProgressNav
          currentPageSection={6}
          completedSections={eligibilityRequirements.completedSections}
          labels={ELIGIBILITY_SECTIONS.map((label) => t(`eligibility.progress.sections.${label}`))}
          routes={ELIGIBILITY_SECTIONS.map((_label, i) => eligibilityRoute(i))}
        />
      </FormCard>
      <FormCard>
        <FormBackLink
          url={eligibilityRoute(CURRENT_PAGE - 1)}
          onClick={() => {
            // Not extra actions needed.
          }}
        />

        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-card__lead pb-0 pt-8">
            <h2 className="form-card__title is-borderless">{t("eligibility.income.prompt")}</h2>
          </div>
          <div className="form-card__group">
            <p className="field-note mb-4" id="income-description">
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
              register={register}
              fields={incomeRanges.map((key) => {
                return {
                  label: t(`eligibility.income.ranges.${key}`),
                  value: key,
                  id: key,
                  defaultChecked: eligibilityRequirements?.income === key,
                }
              })}
            />
          </div>
          <div className="form-card__pager">
            <div className="form-card__pager-row primary">
              <Button styleType={AppearanceStyleType.primary}>{t("t.finish")}</Button>
            </div>
          </div>
        </Form>
      </FormCard>
    </EligibilityLayout>
  )
}

export default EligibilityIncome
