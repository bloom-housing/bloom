import React, { useState, useMemo, useCallback, useContext, useEffect } from "react"
import {
  t,
  MinimalTable,
  FieldGroup,
  StandardTableData,
  Select,
} from "@bloom-housing/ui-components"
import { Button, Dialog, Drawer, FieldValue, Grid, Tag } from "@bloom-housing/ui-seeds"
import {
  EnumUnitGroupAmiLevelMonthlyRentDeterminationType,
  FeatureFlag,
  FeatureFlagEnum,
  HomeTypeEnum,
  MinMax,
  ReviewOrderTypeEnum,
  YesNoEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { AuthContext, MessageContext } from "@bloom-housing/shared-helpers"
import UnitForm from "../UnitForm"
import { useFormContext, useWatch } from "react-hook-form"
import { TempUnit, TempUnitGroup } from "../../../../lib/listings/formTypes"
import { fieldHasError, fieldMessage } from "../../../../lib/helpers"
import SectionWithGrid from "../../../shared/SectionWithGrid"
import { formatRange, formatRentRange, minMaxFinder } from "../../helpers"
import UnitGroupForm from "../UnitGroupForm"

type UnitProps = {
  units: TempUnit[]
  unitGroups: TempUnitGroup[]
  setUnits: (units: TempUnit[]) => void
  setUnitGroups: (unitGroups: TempUnitGroup[]) => void
  disableUnitsAccordion: boolean
  disableListingAvailability?: boolean
  featureFlags?: FeatureFlag[]
}

const FormUnits = ({
  units,
  unitGroups,
  setUnits,
  setUnitGroups,
  disableUnitsAccordion,
  disableListingAvailability,
  featureFlags,
}: UnitProps) => {
  const { addToast } = useContext(MessageContext)
  const [unitDrawerOpen, setUnitDrawerOpen] = useState(false)
  const [unitDeleteModal, setUnitDeleteModal] = useState<number | null>(null)
  const [defaultUnit, setDefaultUnit] = useState<TempUnit | null>(null)
  const [defaultUnitGroup, setDefaultUnitGroup] = useState<TempUnitGroup | null>(null)
  const [homeTypeEnabled, setHomeTypeEnabled] = useState(false)
  const { doJurisdictionsHaveFeatureFlagOn } = useContext(AuthContext)

  const formMethods = useFormContext()
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, errors, clearErrors, getValues, control, setValue } = formMethods
  const listing = getValues()

  const enableSection8Question = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableSection8Question,
    listing?.jurisdictions?.id,
    !listing.jurisdictions?.id
  )

  const enableUnitGroups = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableUnitGroups,
    listing?.jurisdictions?.id,
    !listing.jurisdictions?.id
  )

  const listingAvailability = useWatch({
    control,
    name: "listingAvailabilityQuestion",
  })

  const homeTypes = [
    "",
    ...Object.values(HomeTypeEnum).map((val) => {
      return { value: val, label: t(`homeType.${val}`) }
    }),
  ]

  let nextId
  if (enableUnitGroups) {
    nextId = unitGroups && unitGroups.length > 0 ? unitGroups[unitGroups.length - 1]?.tempId + 1 : 1
  } else {
    nextId = units && units.length > 0 ? units[units.length - 1]?.tempId + 1 : 1
  }

  const unitTableHeaders = enableUnitGroups
    ? {
        unitType: "listings.unit.type",
        number: "listings.unit.totalCount",
        amiPercentage: "listings.unit.ami",
        monthlyRent: "listings.unit.rent",
        occupancy: "listings.unit.occupancy",
        sqFeet: "listings.unit.sqft",
        bath: "listings.unit.bath",
        action: "",
      }
    : {
        number: "listings.unit.number",
        unitType: "listings.unit.type",
        amiPercentage: "listings.unit.ami",
        monthlyRent: "listings.unit.rent",
        sqFeet: "listings.unit.sqft",
        unitAccessibilityPriorityTypes: "listings.unit.priorityType",
        action: "",
      }

  useEffect(() => {
    if (
      getValues("disableUnitsAccordion") === undefined ||
      getValues("disableUnitsAccordion") === null
    ) {
      setValue("disableUnitsAccordion", disableUnitsAccordion ? "true" : "false")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (units && units.length > 0 && !units[0].tempId) {
      units.forEach((unit, index) => {
        unit.tempId = index + 1
      })
    }
  }, [units])

  // If hometype feature flag is not turned on for selected jurisdiction we need to reset the value
  useEffect(() => {
    if (featureFlags) {
      const isHomeTypeEnabled = featureFlags.some(
        (flag) => flag.name === FeatureFlagEnum.enableHomeType
      )
      setHomeTypeEnabled(isHomeTypeEnabled)
      if (!isHomeTypeEnabled) {
        setValue("homeType", "")
      }
    }
  }, [featureFlags, setValue])

  const editUnit = useCallback(
    (tempId: number) => {
      setDefaultUnit(units.filter((unit) => unit.tempId === tempId)[0])
      setUnitDrawerOpen(true)
    },
    [units]
  )

  const editUnitGroup = useCallback(
    (tempId: number) => {
      setDefaultUnitGroup(unitGroups.filter((unitGroup) => unitGroup.tempId === tempId)[0])
      setUnitDrawerOpen(true)
    },
    [unitGroups]
  )

  const deleteUnit = useCallback(
    (tempId: number) => {
      const updatedUnits = units
        .filter((unit) => unit.tempId !== tempId)
        .map((updatedUnit, index) => ({
          ...updatedUnit,
          tempId: index + 1,
        }))

      setUnits(updatedUnits)
      setUnitDeleteModal(null)
    },
    [setUnitDeleteModal, setUnits, units]
  )

  const deleteUnitGroup = useCallback(
    (tempId: number) => {
      const updatedUnitGroups = unitGroups
        .filter((unit) => unit.tempId !== tempId)
        .map((updatedUnit, index) => ({
          ...updatedUnit,
          tempId: index + 1,
        }))

      setUnitGroups(updatedUnitGroups)
      setUnitDeleteModal(null)
    },
    [setUnitDeleteModal, setUnitGroups, unitGroups]
  )

  function saveUnit(newUnit: TempUnit) {
    const exists = units.some((unit) => unit.tempId === newUnit.tempId)
    if (exists) {
      const updateUnits = units.map((unit) => (unit.tempId === newUnit.tempId ? newUnit : unit))
      setUnits(updateUnits)
    } else {
      setUnits([...units, newUnit])
    }
  }

  function saveUnitGroup(newUnitGroup: TempUnitGroup) {
    const exists = unitGroups.some((unitGroup) => unitGroup.tempId === newUnitGroup.tempId)
    if (exists) {
      const updateUnits = unitGroups.map((unitGroup) =>
        unitGroup.tempId === newUnitGroup.tempId ? newUnitGroup : unitGroup
      )
      setUnitGroups(updateUnits)
    } else {
      setUnitGroups([...unitGroups, newUnitGroup])
    }
  }

  const unitTableData: StandardTableData = useMemo(
    () =>
      enableUnitGroups
        ? unitGroups.map((unitGroup) => {
            let amiRange: MinMax, rentRange: MinMax, percentIncomeRange: MinMax

            unitGroup.unitGroupAmiLevels.forEach((ami) => {
              if (ami.amiPercentage) {
                amiRange = minMaxFinder(amiRange, ami.amiPercentage)
              }
              if (
                ami.flatRentValue &&
                ami.monthlyRentDeterminationType ===
                  EnumUnitGroupAmiLevelMonthlyRentDeterminationType.flatRent
              ) {
                rentRange = minMaxFinder(rentRange, ami.flatRentValue)
              }
              if (
                ami.percentageOfIncomeValue &&
                ami.monthlyRentDeterminationType ===
                  EnumUnitGroupAmiLevelMonthlyRentDeterminationType.percentageOfIncome
              ) {
                percentIncomeRange = minMaxFinder(percentIncomeRange, ami.percentageOfIncomeValue)
              }
            })

            return {
              unitType: {
                content:
                  unitGroup?.unitTypes
                    .map((unitType) => t(`listings.unitTypes.${unitType.name}`))
                    .join(", ") || "",
              },
              number: { content: unitGroup.totalCount },
              amiPercentage: {
                content: amiRange && formatRange(amiRange.min, amiRange.max, "", "%"),
              },
              monthlyRent: { content: formatRentRange(rentRange, percentIncomeRange) },
              occupancy: { content: formatRange(unitGroup.minOccupancy, unitGroup.maxOccupancy) },
              sqFeet: { content: formatRange(unitGroup.sqFeetMin, unitGroup.sqFeetMax) },
              bath: { content: formatRange(unitGroup.bathroomMin, unitGroup.bathroomMax) },
              action: {
                content: (
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      className="font-semibold"
                      onClick={() => editUnitGroup(unitGroup.tempId)}
                      variant="text"
                      size="sm"
                    >
                      {t("t.edit")}
                    </Button>
                    <Button
                      type="button"
                      className="font-semibold text-alert"
                      onClick={() => setUnitDeleteModal(unitGroup.tempId)}
                      variant="text"
                      size="sm"
                    >
                      {t("t.delete")}
                    </Button>
                  </div>
                ),
              },
            }
          })
        : units.map((unit) => ({
            number: { content: unit.number },
            unitType: { content: unit.unitTypes && t(`listings.unitTypes.${unit.unitTypes.name}`) },
            amiPercentage: { content: unit.amiPercentage },
            monthlyRent: { content: unit.monthlyRent },
            sqFeet: { content: unit.sqFeet },
            unitAccessibilityPriorityTypes: { content: unit.unitAccessibilityPriorityTypes?.name },
            action: {
              content: (
                <div className="flex gap-3">
                  <Button
                    type="button"
                    className="font-semibold"
                    onClick={() => editUnit(unit.tempId)}
                    variant="text"
                    size="sm"
                  >
                    {t("t.edit")}
                  </Button>
                  <Button
                    type="button"
                    className="font-semibold text-alert"
                    onClick={() => setUnitDeleteModal(unit.tempId)}
                    variant="text"
                    size="sm"
                  >
                    {t("t.delete")}
                  </Button>
                </div>
              ),
            },
          })),
    [editUnit, units, unitGroups, editUnitGroup, enableUnitGroups]
  )
  const disableUnitsAccordionOptions = [
    {
      id: "unitTypes",
      label: t("listings.unit.unitTypes"),
      value: "true",
      dataTestId: "unit-types",
    },
    {
      id: "individualUnits",
      label: t("listings.unit.individualUnits"),
      value: "false",
      dataTestId: "individual-units",
    },
  ]

  return (
    <>
      <hr className="spacer-section-above spacer-section" />
      <SectionWithGrid
        heading={t("listings.units")}
        subheading={t(
          enableUnitGroups ? "listings.unitGroupsDescription" : "listings.unitsDescription"
        )}
      >
        {homeTypeEnabled && (
          <Grid.Row columns={2}>
            <FieldValue label={t("listings.homeType")}>
              {homeTypes && (
                <Select
                  id={`homeType`}
                  name={`homeType`}
                  label={t("listings.homeType")}
                  labelClassName="sr-only"
                  register={register}
                  controlClassName="control"
                  options={homeTypes}
                />
              )}
            </FieldValue>
          </Grid.Row>
        )}
        {!enableUnitGroups && (
          <Grid.Row columns={2}>
            <FieldValue label={t("listings.unitTypesOrIndividual")} className="mb-1">
              <FieldGroup
                name="disableUnitsAccordion"
                type="radio"
                register={register}
                fields={disableUnitsAccordionOptions}
                fieldClassName="m-0"
                fieldGroupClassName="flex h-12 items-center"
              />
            </FieldValue>
            <FieldValue label={t("listings.listingAvailabilityQuestion")} className={"mb-1"}>
              <FieldGroup
                name="listingAvailabilityQuestion"
                type="radio"
                register={register}
                groupSubNote={t("listings.requiredToPublish")}
                error={fieldHasError(errors?.listingAvailability) && listingAvailability === null}
                errorMessage={fieldMessage(errors?.listingAvailability)}
                fieldClassName="m-0"
                fieldGroupClassName="flex h-12 items-center"
                fields={[
                  {
                    label: t("listings.availableUnits"),
                    value: "availableUnits",
                    id: "availableUnits",
                    dataTestId: "listingAvailability.availableUnits",
                    defaultChecked: listing?.reviewOrderType !== ReviewOrderTypeEnum.waitlist,
                    disabled:
                      disableListingAvailability &&
                      listing?.reviewOrderType === ReviewOrderTypeEnum.waitlist,
                  },
                  {
                    label: t("listings.waitlist.open"),
                    value: "openWaitlist",
                    id: "openWaitlist",
                    dataTestId: "listingAvailability.openWaitlist",
                    defaultChecked: listing?.reviewOrderType === ReviewOrderTypeEnum.waitlist,
                    disabled:
                      disableListingAvailability &&
                      listing?.reviewOrderType !== ReviewOrderTypeEnum.waitlist,
                  },
                ]}
              />
            </FieldValue>
          </Grid.Row>
        )}
        <SectionWithGrid.HeadingRow>{t("listings.units")}</SectionWithGrid.HeadingRow>
        <Grid.Row>
          <Grid.Cell className="grid-inset-section">
            {(enableUnitGroups ? !!unitGroups.length : !!units.length) && (
              <div className="mb-5">
                <MinimalTable headers={unitTableHeaders} data={unitTableData} />
              </div>
            )}

            <Button
              id="addUnitsButton"
              type="button"
              variant={fieldHasError(errors?.units) ? "alert" : "primary-outlined"}
              size="sm"
              onClick={() => {
                editUnit(units.length + 1)
                clearErrors("units")
              }}
            >
              {t(enableUnitGroups ? "listings.unitGroupd.add" : "listings.unit.add")}
            </Button>
          </Grid.Cell>
        </Grid.Row>
        {enableSection8Question && (
          <Grid.Row>
            <FieldValue label={t("listings.section8Title")}>
              <FieldGroup
                name="listingSection8Acceptance"
                type="radio"
                register={register}
                fields={[
                  {
                    id: "listingSection8AcceptanceYes",
                    dataTestId: "listingSection8AcceptanceYes",
                    label: t("t.yes"),
                    value: YesNoEnum.yes,
                    defaultChecked: listing?.section8Acceptance,
                  },
                  {
                    id: "listingSection8AcceptanceNo",
                    dataTestId: "listingSection8AcceptanceNo",
                    label: t("t.no"),
                    value: YesNoEnum.no,
                    defaultChecked: !listing?.section8Acceptance,
                  },
                ]}
              />
            </FieldValue>
          </Grid.Row>
        )}
      </SectionWithGrid>

      {!enableUnitGroups && <p className="field-sub-note">{t("listings.requiredToPublish")}</p>}
      {fieldHasError(errors?.units) && (
        <span className={"text-xs text-alert"} id="units-error">
          {t("errors.requiredFieldError")}
        </span>
      )}

      <Drawer
        isOpen={unitDrawerOpen}
        onClose={() => setUnitDrawerOpen(false)}
        ariaLabelledBy="units-drawer-header"
      >
        <Drawer.Header id="units-drawer-header">
          {t(enableUnitGroups ? "listings.unitGroupd.add" : "listings.unit.add")}
          <Tag
            variant={
              units.some((unit) => unit.tempId === defaultUnit?.tempId)
                ? "success-inverse"
                : undefined
            }
          >
            {units.some((unit) => unit.tempId === defaultUnit?.tempId)
              ? t("t.saved")
              : t("t.draft")}
          </Tag>
        </Drawer.Header>
        {enableUnitGroups ? (
          <UnitGroupForm
            onSubmit={(unitGroup) => {
              saveUnitGroup(unitGroup)
            }}
            onClose={() => {
              setUnitDrawerOpen(false)
            }}
            defaultUnitGroup={defaultUnitGroup}
            draft={!unitGroups.some((unitGroup) => unitGroup.tempId === defaultUnitGroup?.tempId)}
            nextId={nextId}
          />
        ) : (
          <UnitForm
            onSubmit={(unit) => {
              saveUnit(unit)
            }}
            onClose={(openNextUnit: boolean, openCurrentUnit: boolean, defaultUnit: TempUnit) => {
              setDefaultUnit(defaultUnit)
              if (openNextUnit) {
                if (defaultUnit) {
                  addToast(t("listings.unit.unitCopied"), { variant: "success" })
                }
                editUnit(nextId)
              } else if (!openCurrentUnit) {
                setUnitDrawerOpen(false)
              } else {
                addToast(t("listings.unit.unitSaved"), { variant: "success" })
              }
            }}
            draft={!units.some((unit) => unit.tempId === defaultUnit?.tempId)}
            defaultUnit={defaultUnit}
            nextId={nextId}
          />
        )}
      </Drawer>

      <Dialog isOpen={!!unitDeleteModal} onClose={() => setUnitDeleteModal(null)}>
        <Dialog.Header>
          {enableUnitGroups ? t("listings.unitGroup.delete") : t("listings.unit.delete")}
        </Dialog.Header>
        <Dialog.Content>
          {enableUnitGroups ? t("listings.unitGroup.deleteConf") : t("listings.unit.deleteConf")}
        </Dialog.Content>
        <Dialog.Footer>
          <Button
            variant="alert"
            onClick={() =>
              enableUnitGroups ? deleteUnitGroup(unitDeleteModal) : deleteUnit(unitDeleteModal)
            }
            size="sm"
          >
            {t("t.delete")}
          </Button>
          <Button
            onClick={() => {
              setUnitDeleteModal(null)
            }}
            variant="primary-outlined"
            size="sm"
          >
            {t("t.cancel")}
          </Button>
        </Dialog.Footer>
      </Dialog>
    </>
  )
}

export default FormUnits
