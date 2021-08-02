import React, { useState, useMemo, useCallback, useEffect } from "react"
import {
  t,
  GridSection,
  MinimalTable,
  Button,
  AppearanceSizeType,
  Drawer,
  Modal,
  AppearanceStyleType,
  AppearanceBorderType,
  ViewItem,
  GridCell,
  FieldGroup,
  GroupedTableGroup,
  GroupedTable,
  groupNonReservedAndReservedSummaries,
} from "@bloom-housing/ui-components"
import UnitForm from "../UnitForm"
import { useFormContext } from "react-hook-form"
import { TempUnit } from "../"
import { UnitsSummarized } from "@bloom-housing/backend-core/types"

type UnitProps = {
  units: TempUnit[]
  setUnits: (units: TempUnit[]) => void
  unitsSummary: UnitsSummarized
  disableUnitsAccordion: boolean
}

const FormUnits = ({ units, setUnits, unitsSummary, disableUnitsAccordion }: UnitProps) => {
  const [unitDrawer, setUnitDrawer] = useState<number | null>(null)
  const [unitDeleteModal, setUnitDeleteModal] = useState<number | null>(null)
  const [unitsSummarized, setUnitsSummarized] = useState<GroupedTableGroup[]>()
  const [showUnitsSummary, setShowUnitsSummary] = useState<boolean>(disableUnitsAccordion)

  const formMethods = useFormContext()
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, setValue } = formMethods

  const unitTableHeaders = {
    number: "listings.unit.number",
    unitType: "listings.unit.type",
    amiPercentage: "listings.unit.ami",
    monthlyRent: "listings.unit.rent",
    sqFeet: "listings.unit.sqft",
    priorityType: "listings.unit.priorityType",
    status: "listings.unit.status",
    action: "",
  }

  useEffect(() => {
    setValue("disableUnitsAccordion", disableUnitsAccordion ? "true" : "false")
  }, [disableUnitsAccordion, setValue])

  useEffect(() => {
    if (unitsSummary !== undefined) {
      setUnitsSummarized(
        groupNonReservedAndReservedSummaries(
          unitsSummary.byNonReservedUnitType,
          unitsSummary.byReservedType
        )
      )
    }
  }, [setUnitsSummarized])

  const editUnit = useCallback(
    (tempId: number) => {
      setUnitDrawer(tempId)
    },
    [setUnitDrawer]
  )

  const editUnitsView = useCallback(() => {
    setShowUnitsSummary(!showUnitsSummary)
  }, [showUnitsSummary, setShowUnitsSummary])

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

  function saveUnit(newUnit: TempUnit) {
    const exists = units.some((unit) => unit.tempId === newUnit.tempId)
    if (exists) {
      const updateUnits = units.map((unit) => (unit.tempId === newUnit.tempId ? newUnit : unit))
      setUnits(updateUnits)
    } else {
      setUnits([...units, newUnit])
    }
  }
  const unitTableData = useMemo(
    () =>
      units.map((unit) => ({
        number: unit.number,
        unitType: unit.unitType && t(`listings.unitTypes.${unit.unitType.name}`),
        amiPercentage: unit.amiPercentage,
        monthlyRent: unit.monthlyRent,
        sqFeet: unit.sqFeet,
        priorityType: unit.priorityType?.name,
        status: unit.status,
        action: (
          <div className="flex">
            <Button
              type="button"
              className="front-semibold uppercase"
              onClick={() => editUnit(unit.tempId)}
              unstyled
            >
              {t("t.edit")}
            </Button>
            <Button
              type="button"
              className="front-semibold uppercase text-red-700"
              onClick={() => setUnitDeleteModal(unit.tempId)}
              unstyled
            >
              {t("t.delete")}
            </Button>
          </div>
        ),
      })),
    [editUnit, units]
  )

  const disableUnitsAccordionOptions = [
    {
      id: "unitTypes",
      label: t("listings.unit.unitTypes"),
      value: "true",
    },
    {
      id: "individualUnits",
      label: t("listings.unit.individualUnits"),
      value: "false",
    },
  ]
  const unitSummariesHeaders = {
    unitType: t("t.unitType"),
    minimumIncome: t("t.minimumIncome"),
    rent: t("t.rent"),
  }

  return (
    <>
      <GridSection
        title={t("listings.units")}
        description={t("listings.unitsDescription")}
        grid={false}
        separator
      >
        <GridSection columns={2}>
          <GridCell>
            <ViewItem label={t("listings.unitTypesOrIndividual")} className="mb-1" />
            <FieldGroup
              name="disableUnitsAccordion"
              type="radio"
              register={register}
              fields={disableUnitsAccordionOptions}
              fieldClassName="m-0"
              fieldGroupClassName="flex h-12 items-center"
              onChange={editUnitsView}
            />
          </GridCell>
        </GridSection>
        {showUnitsSummary && unitsSummarized !== undefined && (
          <div className="listings-row_content w-full">
            <div className="listings-row_table">
              <GroupedTable
                headers={unitSummariesHeaders}
                data={unitsSummarized}
                responsiveCollapse={true}
                cellClassName="px-5 py-3"
              />
            </div>
            <Button type="button" size={AppearanceSizeType.normal} onClick={() => false}>
              {t("t.edit")}
            </Button>
          </div>
        )}
        {!showUnitsSummary && (
          <div className="bg-gray-300 px-4 py-5">
            {!!units.length && (
              <div className="mb-5">
                <MinimalTable headers={unitTableHeaders} data={unitTableData} />
              </div>
            )}
            <Button
              type="button"
              size={AppearanceSizeType.normal}
              onClick={() => editUnit(units.length + 1)}
            >
              {t("listings.unit.add")}
            </Button>
          </div>
        )}
      </GridSection>

      <Drawer
        open={!!unitDrawer}
        title={t("listings.unit.add")}
        ariaDescription={t("listings.unit.add")}
        onClose={() => setUnitDrawer(null)}
      >
        <UnitForm
          onSubmit={(unit) => saveUnit(unit)}
          onClose={() => setUnitDrawer(null)}
          units={units}
          currentTempId={unitDrawer}
        />
      </Drawer>

      <Modal
        open={!!unitDeleteModal}
        title={t("listings.unit.delete")}
        ariaDescription={t("listings.unit.deleteConf")}
        onClose={() => setUnitDeleteModal(null)}
        actions={[
          <Button styleType={AppearanceStyleType.alert} onClick={() => deleteUnit(unitDeleteModal)}>
            {t("t.delete")}
          </Button>,
          <Button
            styleType={AppearanceStyleType.primary}
            border={AppearanceBorderType.borderless}
            onClick={() => {
              setUnitDeleteModal(null)
            }}
          >
            {t("t.cancel")}
          </Button>,
        ]}
      >
        {t("listings.unit.deleteConf")}
      </Modal>
    </>
  )
}

export default FormUnits
