import React from "react"
import { useFormContext } from "react-hook-form"
import {
  t,
  GridSection,
  ViewItem,
  GridCell,
  Field,
  FieldGroup,
  preferredUnit,
} from "@bloom-housing/ui-components"

export enum FormHouseholdDetailsFields {
  PreferredUnit = "application.preferredUnit",
  Mobility = "application.accessibility.mobility",
  Vision = "application.accessibility.vision",
  Hearing = "application.accessibility.hearing",
}

const FormHouseholdDetails = () => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register } = formMethods

  const preferredUnitOptions = preferredUnit?.map((item) => ({
    id: item.id,
    label: t(`application.household.preferredUnit.options.${item.id}`),
  }))

  return (
    <GridSection title={t("application.review.householdDetails")} columns={3} separator>
      <GridCell>
        <ViewItem label={t("application.details.preferredUnitSizes")}>
          <FieldGroup
            type="checkbox"
            name={FormHouseholdDetailsFields.PreferredUnit}
            fields={preferredUnitOptions}
            register={register}
            fieldGroupClassName="grid grid-cols-1 mt-4"
          />
        </ViewItem>
      </GridCell>
      <GridCell>
        <ViewItem label={t("application.details.adaPriorities")}>
          <fieldset className="mt-4">
            <Field
              id={FormHouseholdDetailsFields.Mobility}
              name={FormHouseholdDetailsFields.Mobility}
              type="checkbox"
              label={t("application.add.mobility")}
              register={register}
            />

            <Field
              id={FormHouseholdDetailsFields.Vision}
              name={FormHouseholdDetailsFields.Vision}
              type="checkbox"
              label={t("application.add.vision")}
              register={register}
            />

            <Field
              id={FormHouseholdDetailsFields.Hearing}
              name={FormHouseholdDetailsFields.Hearing}
              type="checkbox"
              label={t("application.add.hearing")}
              register={register}
            />
          </fieldset>
        </ViewItem>
      </GridCell>
    </GridSection>
  )
}

export { FormHouseholdDetails as default, FormHouseholdDetails }
