/*
Disability
Whether the applicant has accessibility needs.
*/
import { t } from "@bloom-housing/ui-components"
import { FieldGroup } from "../../../../../detroit-ui-components/src/forms/FieldGroup"
import { FieldValues, useForm } from "react-hook-form"
import React, { useContext } from "react"
import { EligibilityContext } from "../../lib/applications/EligibilityContext"
import EligibilityLayout from "../../layouts/eligibility"

const EligibilityDisability = () => {
  const { eligibilityRequirements } = useContext(EligibilityContext)

  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const formMethods = useForm({
    defaultValues: {
      disability: eligibilityRequirements?.disability,
    } as FieldValues,
  })

  const onSubmitDisability = (data) => {
    eligibilityRequirements.setDisability(data.disability)
  }

  const disabilityValues = [
    {
      id: "disabilityNo",
      value: "false",
      label: t("t.no"),
    },
    {
      id: "disabilityYes",
      value: "true",
      label: t("t.yes"),
    },
    {
      id: "disabilityPreferNotToSay",
      value: "preferNotToSay",
      label: t("eligibility.preferNotToSay"),
    },
  ]

  return (
    <EligibilityLayout
      title={t("eligibility.disability.prompt")}
      currentPage={3}
      formMethods={formMethods}
      onFinishStep={onSubmitDisability}
    >
      <div className="form-card__group px-0 mx-0">
        <p className="mb-4">{t("eligibility.disability.description")}</p>
        <fieldset>
          <legend className="sr-only">{t("eligibility.disability.prompt")}</legend>
          <FieldGroup
            type="radio"
            name="disability"
            // eslint-disable-next-line @typescript-eslint/unbound-method
            register={formMethods.register}
            fields={disabilityValues}
          />
        </fieldset>
      </div>
    </EligibilityLayout>
  )
}

export default EligibilityDisability
