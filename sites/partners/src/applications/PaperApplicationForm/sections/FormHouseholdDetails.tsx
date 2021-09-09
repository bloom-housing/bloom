import React, { useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"
import { t, GridSection, ViewItem, GridCell, Field, FieldGroup } from "@bloom-housing/ui-components"
import { getUniqueUnitTypes } from "@bloom-housing/ui-components/src/helpers/unitTypes"
import { Unit, UnitType } from "@bloom-housing/backend-core/types"

type FormHouseholdDetailsProps = {
  listingUnits: Unit[]
  applicationUnitTypes: UnitType[]
}

const FormHouseholdDetails = ({
  listingUnits,
  applicationUnitTypes,
}: FormHouseholdDetailsProps) => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register } = formMethods

  const unitTypes = getUniqueUnitTypes(listingUnits)

  const preferredUnitOptions = unitTypes?.map((item) => {
    const isChecked = !!applicationUnitTypes?.find((unit) => unit.id === item.id) ?? false

    return {
      id: item.id,
      label: t(`application.household.preferredUnit.options.${item.name}`),
      value: item.id,
      defaultChecked: isChecked,
    }
  })

  return (
    <GridSection title={t("application.review.householdDetails")} columns={3} separator>
      <GridCell>
        <ViewItem label={t("application.details.preferredUnitSizes")}>
          <FieldGroup
            type="checkbox"
            name="application.preferredUnit"
            fields={preferredUnitOptions}
            register={register}
            fieldGroupClassName="grid grid-cols-1 mt-4"
            fieldClassName="ml-0"
          />
        </ViewItem>
      </GridCell>
      <GridCell>
        <ViewItem label={t("application.details.adaPriorities")}>
          <fieldset className="mt-4">
            <Field
              id="application.accessibility.mobility"
              name="application.accessibility.mobility"
              type="checkbox"
              label={t("application.add.mobility")}
              register={register}
            />

            <Field
              id="application.accessibility.vision"
              name="application.accessibility.vision"
              type="checkbox"
              label={t("application.add.vision")}
              register={register}
            />

            <Field
              id="application.accessibility.hearing"
              name="application.accessibility.hearing"
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
