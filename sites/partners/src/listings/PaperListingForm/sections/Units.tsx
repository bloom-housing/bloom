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
} from "@bloom-housing/ui-components"
import { useFormContext } from "react-hook-form"
import UnitsSummaryForm from "../UnitsSummaryForm"
import { TempUnit, TempUnitsSummary } from "../formTypes"
import { fieldHasError } from "../../../../lib/helpers"
import { useUnitTypeList } from "../../../../lib/hooks"

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

function formatRange(min: string | number, max: string | number, prefix: string, postfix: string) {
  if (!isDefined(min) && !isDefined(max)) return ""
  if (min == max || !isDefined(max)) return `${prefix}${min}${postfix}`
  if (!isDefined(min)) return `${prefix}${max}${postfix}`
  return `${prefix}${min}${postfix} - ${prefix}${max}${postfix}`
}

const FormUnits = ({ unitsSummaries, setSummaries, disableUnitsAccordion }: UnitProps) => {
  const [summaryDrawer, setSummaryDrawer] = useState<number | null>(null)
  const [summaryDeleteModal, setSummaryDeleteModal] = useState<number | null>(null)

  const formMethods = useFormContext()
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { setValue, errors, clearErrors } = formMethods
  const { data: unitTypesData = [] } = useUnitTypeList()

  const unitTypeOptions = unitTypesData.map((unitType) => {
    return {
      id: unitType.id,
      label: t(`listings.unitsSummary.${unitType.name}`),
      value: unitType.id,
    }
  })

  const unitSummariesHeaders = {
    unitType: "listings.unit.type",
    units: "listings.unitsSummary.numUnits",
    amiRange: "listings.unitsSummary.amiRange",
    rentRange: "listings.unitsSummary.rentRange",
    occupancyRange: "listings.unitsSummary.occupancyRange",
    sqFeetRange: "listings.unitsSummary.sqftRange",
    bathRange: "listings.unitsSummary.bathRange",
    action: "",
  }

  useEffect(() => {
    setValue("disableUnitsAccordion", disableUnitsAccordion ? "true" : "false")
  }, [disableUnitsAccordion, setValue])

  const editSummary = useCallback(
    (tempId: number) => {
      setSummaryDrawer(tempId)
    },
    [setSummaryDrawer]
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

  const saveUnitsSummary = (newSummary: TempUnitsSummary) => {
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
      unitsSummaries?.map((summary) => {
        let types = unitTypeOptions.filter((option) =>
          summary.unitType.some((type) => option.id === type.toString() || option.id === type.id)
        )
        let amiRange = [undefined, undefined]
        let rentRange = [undefined, undefined]
        summary?.amiLevels?.forEach((ami) => {
          if (ami.amiPercentage) {
            if (amiRange[0] === undefined) {
              amiRange[0] = ami.amiPercentage
              amiRange[1] = ami.amiPercentage
            }
            if (ami.amiPercentage < amiRange[0]) {
              amiRange[0] = ami.amiPercentage
            } else if (ami.amiPercentage > amiRange[1]) {
              amiRange[1] = ami.amiPercentage
            }
          }
          if (ami.flatRentValue) {
            if (rentRange[0] === undefined) {
              rentRange[0] = ami.flatRentValue
              rentRange[1] = ami.flatRentValue
            }
            if (ami.flatRentValue < rentRange[0]) {
              rentRange[0] = ami.flatRentValue
            } else if (ami.flatRentValue > rentRange[1]) {
              rentRange[1] = ami.flatRentValue
            }
          } else if (ami.percentageOfIncomeValue) {
            if (rentRange[0] === undefined) {
              rentRange[0] = ami.percentageOfIncomeValue
              rentRange[1] = ami.percentageOfIncomeValue
            }
            if (ami.percentageOfIncomeValue < rentRange[0]) {
              rentRange[0] = ami.percentageOfIncomeValue
            } else if (ami.percentageOfIncomeValue > rentRange[1]) {
              rentRange[1] = ami.percentageOfIncomeValue
            }
          }
        })

        return {
          unitType: types.map((option) => option.label).join(", "),
          units: summary.totalCount,
          amiRange: formatRange(amiRange[0], amiRange[1], "", "%"),
          rentRange: formatRange(rentRange[0], rentRange[1], "$", ""),
          occupancyRange: formatRange(summary.minOccupancy, summary.maxOccupancy, "", ""),
          sqFeetRange: formatRange(summary.sqFeetMin, summary.sqFeetMax, "", ""),
          bathRange: formatRange(summary.bathroomMin, summary.bathroomMax, "", ""),
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
        }
      }),
    [unitsSummaries, editSummary, unitTypeOptions]
  )

  return (
    <>
      <GridSection
        title={t("listings.units")}
        description={t("listings.unitsDescription")}
        grid={false}
        separator
      >
        <div className="bg-gray-300 px-4 py-5">
          {unitsSummaries.length ? (
            <div className="mb-5">
              <MinimalTable
                headers={unitSummariesHeaders}
                data={unitsSummaryTableData}
                responsiveCollapse={true}
              />
            </div>
          ) : null}
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
      </GridSection>
      {fieldHasError(errors?.unitsSummaries) && (
        <span className={"text-sm text-alert"}>{t("errors.requiredFieldError")}</span>
      )}
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
          unitTypeOptions={unitTypeOptions}
        />
      </Drawer>

      <Modal
        open={!!summaryDeleteModal}
        title={t("listings.unitsSummary.delete")}
        ariaDescription={t("listings.unitsSummary.deleteConf")}
        onClose={() => setSummaryDeleteModal(null)}
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
