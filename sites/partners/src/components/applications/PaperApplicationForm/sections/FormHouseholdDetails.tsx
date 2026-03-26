import React from "react"
import { useFormContext } from "react-hook-form"
import { t, Field, FieldGroup } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { getUniqueUnitTypes, getUniqueUnitGroupUnitTypes } from "@bloom-housing/shared-helpers"
import SectionWithGrid from "../../../shared/SectionWithGrid"
import {
  Accessibility,
  ApplicationAccessibilityFeatureEnum,
  EnumListingListingType,
  Unit,
  UnitGroup,
  UnitType,
  YesNoEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"

type FormHouseholdDetailsProps = {
  listingUnits: Unit[]
  applicationUnitTypes: UnitType[]
  applicationAccessibilityFeatures: Accessibility
  listingUnitGroups?: UnitGroup[]
  enableUnitGroups?: boolean
  enableFullTimeStudentQuestion?: boolean
  listingType?: EnumListingListingType
  visibleApplicationAccessibilityFeatures?: ApplicationAccessibilityFeatureEnum[]
}

const FormHouseholdDetails = ({
  listingUnits,
  applicationUnitTypes,
  applicationAccessibilityFeatures,
  listingUnitGroups,
  visibleApplicationAccessibilityFeatures,
  enableUnitGroups,
  enableFullTimeStudentQuestion,
  listingType,
}: FormHouseholdDetailsProps) => {
  const formMethods = useFormContext()
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register } = formMethods

  const unitTypes = getUniqueUnitTypes(listingUnits)
  const unitGroupUnitTypes = getUniqueUnitGroupUnitTypes(listingUnitGroups, listingType)

  const preferredUnitOptions = unitTypes?.map((item) => {
    const isChecked = !!applicationUnitTypes?.find((unit) => unit.id === item.id)

    return {
      id: item.id,
      label: t(`application.household.preferredUnit.options.${item.name}`),
      value: item.id,
      defaultChecked: isChecked,
      dataTestId: `preferredUnit.${item.name}`,
    }
  })

  const preferredUnitGroupOptions = unitGroupUnitTypes?.map((item) => {
    const isChecked = !!applicationUnitTypes?.find((unit) => unit.id === item.id)

    return {
      id: item.id,
      label: t(`application.household.preferredUnit.options.${item.name}`),
      value: item.id,
      defaultChecked: isChecked,
      dataTestId: `preferredUnit.${item.name}`,
    }
  })

  const orderedVisibleAdaFeatures = visibleApplicationAccessibilityFeatures.sort((a, b) => {
    if (a === "other") return 1
    if (b === "other") return -1
    return 0
  })

  const adaFeaturesOptions = orderedVisibleAdaFeatures.map((item) => {
    const isChecked = applicationAccessibilityFeatures?.[item] === true

    return {
      id: item,
      label: t(`application.ada.${item}`),
      value: item,
      defaultChecked: isChecked,
      dataTestId: `adaFeature.${item}`,
    }
  })

  return (
    <>
      <hr className="spacer-section-above spacer-section" />
      <SectionWithGrid heading={t("application.review.householdDetails")}>
        <Grid.Row>
          {((enableUnitGroups && preferredUnitGroupOptions.length > 0) || !enableUnitGroups) && (
            <Grid.Cell>
              <FieldGroup
                type="checkbox"
                name="application.preferredUnit"
                fields={enableUnitGroups ? preferredUnitGroupOptions : preferredUnitOptions}
                groupLabel={t("application.details.preferredUnitSizes")}
                register={register}
                fieldGroupClassName="grid grid-cols-1 mt-4"
                fieldClassName="ml-0"
              />
            </Grid.Cell>
          )}

          <Grid.Cell>
            <fieldset>
              <FieldGroup
                type="checkbox"
                name="application.accessibility"
                fields={adaFeaturesOptions}
                register={register}
                groupLabel={t("application.details.adaPriorities")}
                fieldGroupClassName="grid grid-cols-1 mt-4"
                fieldClassName="ml-0"
              />
            </fieldset>
          </Grid.Cell>

          <Grid.Cell>
            <FieldValue label={t("application.household.expectingChanges.title")}>
              <div className="flex h-12 items-center">
                <Field
                  id="application.householdExpectingChangesYes"
                  name="application.householdExpectingChanges"
                  className="m-0"
                  type="radio"
                  label={t("t.yes")}
                  register={register}
                  inputProps={{
                    value: YesNoEnum.yes,
                  }}
                />

                <Field
                  id="application.householdExpectingChangesNo"
                  name="application.householdExpectingChanges"
                  className="m-0"
                  type="radio"
                  label={t("t.no")}
                  register={register}
                  inputProps={{
                    value: YesNoEnum.no,
                  }}
                />
              </div>
            </FieldValue>
          </Grid.Cell>
        </Grid.Row>
        <Grid.Row columns="3">
          <Grid.Cell>
            <FieldValue
              label={
                enableFullTimeStudentQuestion
                  ? t("application.household.householdStudentAll.title")
                  : t("application.household.householdStudent.title")
              }
            >
              <div className="flex h-12 items-center">
                <Field
                  id="application.householdStudentYes"
                  name="application.householdStudent"
                  className="m-0"
                  type="radio"
                  label={t("t.yes")}
                  register={register}
                  inputProps={{
                    value: YesNoEnum.yes,
                  }}
                />

                <Field
                  id="application.householdStudentNo"
                  name="application.householdStudent"
                  className="m-0"
                  type="radio"
                  label={t("t.no")}
                  register={register}
                  inputProps={{
                    value: YesNoEnum.no,
                  }}
                />
              </div>
            </FieldValue>
          </Grid.Cell>
        </Grid.Row>
      </SectionWithGrid>
    </>
  )
}

export { FormHouseholdDetails as default, FormHouseholdDetails }
