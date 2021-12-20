/*
Age
Prompts the user for their age to filter for properties that are age dependent.
*/
import { t, FieldGroup } from "@bloom-housing/ui-components"
import { useForm } from "react-hook-form"
import styles from "./EligibilityAge.module.scss"
import React, { useContext } from "react"
import { AgeRangeType, EligibilityContext } from "../../lib/EligibilityContext"
import EligibilityLayout from "../../layouts/eligibility"

const EligibilityAge = () => {
  const { eligibilityRequirements } = useContext(EligibilityContext)
  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const formMethods = useForm()

  const onSubmitAge = (data) => {
    eligibilityRequirements.setAge(data.age)
  }

  const ageValues = [
    {
      id: "ageLessThan55",
      value: AgeRangeType.LessThanFiftyFive,
      label: t("eligibility.age.lessThan55"),
      defaultChecked: eligibilityRequirements?.age == AgeRangeType.LessThanFiftyFive,
    },
    {
      id: "age55to61",
      value: AgeRangeType.FiftyFiveToSixtyOne,
      label: t("eligibility.age.55to61"),
      defaultChecked: eligibilityRequirements?.age == AgeRangeType.FiftyFiveToSixtyOne,
    },
    {
      id: "age62+",
      value: AgeRangeType.SixtyTwoAndUp,
      label: t("eligibility.age.62plus"),
      defaultChecked: eligibilityRequirements?.age == AgeRangeType.SixtyTwoAndUp,
    },
    {
      id: "preferNotToSay",
      value: AgeRangeType.PreferNotSay,
      label: t("eligibility.preferNotToSay"),
      defaultChecked: eligibilityRequirements?.age == AgeRangeType.PreferNotSay,
    },
  ]

  return (
    <EligibilityLayout
      title={t("eligibility.age.prompt")}
      currentPage={2}
      formMethods={formMethods}
      onFinishStep={onSubmitAge}
    >
      <div className="form-card__group px-0 mx-0">
        <p className="mb-4" id="age-description">
          {t("eligibility.age.description")}
        </p>
        <FieldGroup
          type="radio"
          fieldGroupClassName={styles.age_field}
          name="age"
          // eslint-disable-next-line @typescript-eslint/unbound-method
          register={formMethods.register}
          fields={ageValues}
        />
      </div>
    </EligibilityLayout>
  )
}

export default EligibilityAge
