/*
Household Size Count
Prompts the user for the number of members in their household.
*/
import { Select, t } from "@bloom-housing/ui-components"
import { FieldValues, useForm } from "react-hook-form"
import React, { useContext } from "react"
import { EligibilityContext } from "../../lib/applications/EligibilityContext"
import EligibilityLayout from "../../layouts/eligibility"

const EligibilityHouseholdSize = () => {
  const { eligibilityRequirements } = useContext(EligibilityContext)

  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const formMethods = useForm({
    defaultValues: {
      householdSize: eligibilityRequirements?.householdSizeCount,
    } as FieldValues,
  })

  const onSubmitHouseholdSize = (data) => {
    eligibilityRequirements.setHouseholdSizeCount(data.householdSize)
  }

  const householdSizeRanges = ["one", "two", "three", "four", "five", "six", "seven", "eight"]

  return (
    <EligibilityLayout
      title={t("eligibility.household.prompt")}
      currentPage={1}
      onFinishStep={onSubmitHouseholdSize}
      formMethods={formMethods}
    >
      <div className="form-card__group px-0 mx-0">
        <legend className="sr-only">{t("eligibility.household.prompt")}</legend>
        <Select
          id="householdSize"
          name="householdSize"
          label={t("eligibility.household.srCountLabel")}
          describedBy="householdSize-description"
          validation={{ required: true }}
          // eslint-disable-next-line @typescript-eslint/unbound-method
          register={formMethods.register}
          controlClassName="control"
          placeholder={t("t.selectOne")}
          options={householdSizeRanges}
          keyPrefix="eligibility.household.ranges"
        />
      </div>
    </EligibilityLayout>
  )
}

export default EligibilityHouseholdSize
