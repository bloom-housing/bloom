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
} from "@bloom-housing/ui-components"
import UnitForm from "../UnitForm"
import { useFormContext } from "react-hook-form"
import { TempUnit, TempUnitsSummary } from "../"
import UnitsSummaryForm from "../UnitsSummaryForm"
import { UnitsSummary } from "@bloom-housing/backend-core/types"
import { fieldHasError } from "../../../../lib/helpers"

type UnitProps = {
  units: TempUnit[]
  unitsSummaries: TempUnitsSummary[]
  setUnits: (units: TempUnit[]) => void
  setSummaries: (summaries: TempUnitsSummary[]) => void
  disableUnitsAccordion: boolean
}

function isDefined(item: number | string) {
  return item !== null && item !== undefined && item !== ""
}

function formatRange(min: string | number, max: string | number, prefix: string) {
  if (!isDefined(min) && !isDefined(max)) return ""
  if (min == max || !isDefined(max)) return `${prefix}${min}`
  if (!isDefined(min)) return `${prefix}${max}`
  return `${prefix}${min} - ${prefix}${max}`
}

const FormUnits = ({
  units,
  setUnits,
  unitsSummaries,
  setSummaries,
  disableUnitsAccordion,
}: UnitProps) => {
  const [unitDrawerId, setUnitDrawerId] = useState<number | null>(null)
  const [unitDeleteModal, setUnitDeleteModal] = useState<number | null>(null)
  const [defaultUnit, setDefaultUnit] = useState<TempUnit | null>(null)
  const [summaryDrawer, setSummaryDrawer] = useState<number | null>(null)
  const [summaryDeleteModal, setSummaryDeleteModal] = useState<number | null>(null)
  const [showUnitsSummary, setShowUnitsSummary] = useState<boolean>(disableUnitsAccordion)

  const formMethods = useFormContext()
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, setValue, errors, clearErrors } = formMethods

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

  const unitSummariesHeaders = {
    unitType: "listings.unit.type",
    amiPercentage: "listings.unit.ami",
    monthlyRent: "listings.unit.rent",
    sqFeet: "listings.unit.sqft",
    priorityType: "listings.unit.priorityType",
    occupancy: "listings.unitsSummary.occupancy",
    totalAvailable: "listings.unitsSummary.available",
    totalCount: "listings.unitsSummary.count",
    action: "",
  }

  useEffect(() => {
    setValue("disableUnitsAccordion", disableUnitsAccordion ? "true" : "false")
  }, [disableUnitsAccordion, setValue])

  useEffect(() => {
    if (units && units.length > 0 && !units[0].tempId) {
      units.forEach((unit, index) => {
        unit.tempId = index + 1
      })
    }
  }, [units])

  const editUnit = (tempId: number) => {
    setDefaultUnit(units.filter((unit) => unit.tempId === tempId)[0])
    setUnitDrawerId(tempId)
  }

  const editSummary = useCallback(
    (tempId: number) => {
      setSummaryDrawer(tempId)
    },
    [setSummaryDrawer]
  )

  const editUnitsView = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // See below in showUnitsSummaryOptions for ids.
      setShowUnitsSummary(e.target.id === "summaries")
    },
    [setShowUnitsSummary]
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

  const deleteSummary = useCallback(
    (tempId: number) => {
      const updatedSummaries = unitsSummaries
        .filter((summary) => summary.tempId !== tempId)
        .map((updatedUnit, index) => ({
          ...updatedUnit,
          tempId: index + 1,
        }))

      setSummaries(updatedSummaries)
      setSummaryDeleteModal(null)
    },
    [setSummaryDeleteModal, setSummaries, unitsSummaries]
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
        status: t(`listings.unit.statusOptions.${unit.status}`),
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

  const getRentFromSummary = (summary: UnitsSummary) => {
    if (summary.monthlyRentMin || summary.monthlyRentMax) {
      return formatRange(summary.monthlyRentMin, summary.monthlyRentMax, "$")
    }
    if (summary.monthlyRentAsPercentOfIncome) {
      return `${summary.monthlyRentAsPercentOfIncome}%`
    }
  }

  function saveUnitsSummary(newSummary: TempUnitsSummary) {
    const exists = unitsSummaries.some((summary) => summary.tempId === newSummary.tempId)
    if (exists) {
      const updateSummaries = unitsSummaries.map((summary) =>
        summary.tempId === newSummary.tempId ? newSummary : summary
      )
      setSummaries(updateSummaries)
    } else {
      setSummaries([...unitsSummaries, newSummary])
    }
  }
  const unitsSummaryTableData = useMemo(
    () =>
      unitsSummaries?.map((summary) => ({
        unitType: summary.unitType && t(`listings.unitTypes.${summary.unitType.name}`),
        amiPercentage: isDefined(summary.amiPercentage) ? `${summary.amiPercentage}%` : "",
        monthlyRent: getRentFromSummary(summary),
        sqFeet: formatRange(summary.sqFeetMin, summary.sqFeetMax, ""),
        priorityType: summary.priorityType?.name,
        occupancy: formatRange(summary.minOccupancy, summary.maxOccupancy, ""),
        totalAvailable: summary.totalAvailable,
        totalCount: summary.totalCount,
        action: (
          <div className="flex">
            <Button
              type="button"
              className="front-semibold uppercase"
              onClick={() => editSummary(summary.tempId)}
              unstyled
            >
              {t("t.edit")}
            </Button>
            <Button
              type="button"
              className="front-semibold uppercase text-red-700"
              onClick={() => setSummaryDeleteModal(summary.tempId)}
              unstyled
            >
              {t("t.delete")}
            </Button>
          </div>
        ),
      })),
    [unitsSummaries, editSummary]
  )

  const showUnitsSummaryOptions = [
    {
      id: "summaries",
      label: t("listings.unit.unitTypes"),
      value: "true",
      defaultChecked: showUnitsSummary,
    },
    {
      id: "units",
      label: t("listings.unit.individualUnits"),
      value: "false",
      defaultChecked: !showUnitsSummary,
    },
  ]

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
              name="displaySummaryData"
              type="radio"
              register={register}
              fields={showUnitsSummaryOptions}
              fieldClassName="m-0"
              fieldGroupClassName="flex h-12 items-center"
              onChange={editUnitsView}
            />
          </GridCell>
        </GridSection>
        <span className={"text-tiny text-gray-800 block mb-2"}>{t("listings.units")}</span>
        {showUnitsSummary && (
          <div className="bg-gray-300 px-4 py-5">
            <div className="mb-5">
              <MinimalTable
                headers={unitSummariesHeaders}
                data={unitsSummaryTableData}
                responsiveCollapse={true}
              />
            </div>
            <Button
              type="button"
              size={AppearanceSizeType.normal}
              styleType={fieldHasError(errors?.unitsSummaries) ? AppearanceStyleType.alert : null}
              onClick={() => {
                editSummary(unitsSummaries.length + 1)
                clearErrors("unitsSummaries")
              }}
            >
              {t("listings.unitsSummary.add")}
            </Button>
          </div>
        )}
        {!showUnitsSummary && (
          <div className="bg-gray-300 px-4 py-5">
            {!!units.length && (
              <div className="mb-5">
                <MinimalTable
                  headers={unitTableHeaders}
                  data={unitTableData}
                  responsiveCollapse={true}
                />
              </div>
            )}
            <Button
              type="button"
              size={AppearanceSizeType.normal}
              styleType={fieldHasError(errors?.units) ? AppearanceStyleType.alert : null}
              onClick={() => {
                editUnit(units.length + 1)
                clearErrors("units")
              }}
            >
              {t("listings.unit.add")}
            </Button>
          </div>
        )}
      </GridSection>

      <p className="field-sub-note">{t("listings.requiredToPublish")}</p>
      {fieldHasError(errors?.units) && (
        <span className={"text-sm text-alert"}>{t("errors.requiredFieldError")}</span>
      )}
      {fieldHasError(errors?.unitsSummaries) && (
        <span className={"text-sm text-alert"}>{t("errors.requiredFieldError")}</span>
      )}

      <Drawer
        open={!!unitDrawerId}
        title={t("listings.unit.add")}
        ariaDescription={t("listings.unit.add")}
        onClose={() => setUnitDrawerId(null)}
      >
        <UnitForm
          onSubmit={(unit) => saveUnit(unit)}
          onClose={(reopen: boolean, defaultUnit: TempUnit) => {
            if (reopen) {
              if (defaultUnit) {
                setDefaultUnit(defaultUnit)
                editUnit(units.length + 1)
              } else {
                setDefaultUnit(null)
                setUnitDrawerId(units.length + 1)
              }
            } else {
              setDefaultUnit(null)
              setUnitDrawerId(null)
            }
          }}
          defaultUnit={defaultUnit}
          existingId={units.filter((unit) => unit.tempId === defaultUnit?.tempId)[0]?.tempId}
          nextId={units.length + 1}
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

      <Drawer
        open={!!summaryDrawer}
        title={t("listings.unitsSummary.add")}
        ariaDescription={t("listings.unitsSummary.add")}
        onClose={() => setSummaryDrawer(null)}
      >
        <UnitsSummaryForm
          onSubmit={(summary) => saveUnitsSummary(summary)}
          onClose={() => setSummaryDrawer(null)}
          summaries={unitsSummaries}
          currentTempId={summaryDrawer}
        />
      </Drawer>

      <Modal
        open={!!summaryDeleteModal}
        title={t("listings.unitsSummary.delete")}
        ariaDescription={t("listings.unitsSummary.deleteConf")}
        onClose={() => setUnitDeleteModal(null)}
        actions={[
          <Button
            styleType={AppearanceStyleType.alert}
            onClick={() => deleteSummary(summaryDeleteModal)}
          >
            {t("t.delete")}
          </Button>,
          <Button
            styleType={AppearanceStyleType.primary}
            border={AppearanceBorderType.borderless}
            onClick={() => {
              setSummaryDeleteModal(null)
            }}
          >
            {t("t.cancel")}
          </Button>,
        ]}
      >
        {t("listings.unitsSummary.deleteConf")}
      </Modal>
    </>
  )
}

export default FormUnits
