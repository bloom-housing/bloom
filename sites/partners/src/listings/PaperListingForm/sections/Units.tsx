import React, { useState, useMemo, useCallback, useEffect } from "react"
import {
  t,
  GridSection,
  MinimalTable,
  AppearanceSizeType,
  AppearanceStyleType,
  AppearanceBorderType,
  GridCell,
  Select,
} from "@bloom-housing/ui-components"
import { Button } from "../../../../../../detroit-ui-components/src/actions/Button"
import { ViewItem } from "../../../../../../detroit-ui-components/src/blocks/ViewItem"
import { FieldGroup } from "../../../../../../detroit-ui-components/src/forms/FieldGroup"
import { Drawer } from "../../../../../../detroit-ui-components/src/overlays/Drawer"
import { Modal } from "../../../../../../detroit-ui-components/src/overlays/Modal"
import { useFormContext } from "react-hook-form"
import UnitsSummaryForm from "../UnitsSummaryForm"
import { FormListing, TempUnit, TempUnitsSummary } from "../formTypes"
import { fieldHasError } from "../../../../lib/helpers"
import { useUnitTypeList } from "../../../../lib/hooks"
import {
  HomeTypeEnum,
  MinMax,
  MonthlyRentDeterminationType,
} from "@bloom-housing/backend-core/types"
import { minMaxFinder, formatRange, formatRentRange } from "@bloom-housing/shared-helpers"
import { YesNoAnswer } from "../../../applications/PaperApplicationForm/FormTypes"

type UnitProps = {
  listing: FormListing
  units: TempUnit[]
  unitsSummaries: TempUnitsSummary[]
  setUnits: (units: TempUnit[]) => void
  setSummaries: (summaries: TempUnitsSummary[]) => void
  disableUnitsAccordion: boolean
}

const FormUnits = ({ listing, unitsSummaries, setSummaries, disableUnitsAccordion }: UnitProps) => {
  const [summaryDrawer, setSummaryDrawer] = useState<number | null>(null)
  const [summaryDeleteModal, setSummaryDeleteModal] = useState<number | null>(null)
  const formMethods = useFormContext()
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { errors, clearErrors, register, reset, getValues } = formMethods
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
  const yesNoRadioOptions = [
    {
      label: t("t.yes"),
      value: YesNoAnswer.Yes,
    },
    {
      label: t("t.no"),
      value: YesNoAnswer.No,
    },
  ]
  useEffect(() => {
    reset({ ...getValues(), disableUnitsAccordion: disableUnitsAccordion ? "true" : "false" })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
        const types = unitTypeOptions.filter((option) =>
          summary.unitType.some((type) => option.id === type.toString() || option.id === type.id)
        )
        let amiRange: MinMax, rentRange: MinMax, percentIncomeRange: MinMax
        summary?.amiLevels?.forEach((ami) => {
          if (ami.amiPercentage) {
            amiRange = minMaxFinder(amiRange, ami.amiPercentage)
          }
          if (
            ami.flatRentValue &&
            ami.monthlyRentDeterminationType === MonthlyRentDeterminationType.flatRent
          ) {
            rentRange = minMaxFinder(rentRange, ami.flatRentValue)
          }
          if (
            ami.percentageOfIncomeValue &&
            ami.monthlyRentDeterminationType === MonthlyRentDeterminationType.percentageOfIncome
          ) {
            percentIncomeRange = minMaxFinder(percentIncomeRange, ami.percentageOfIncomeValue)
          }
        })

        return {
          unitType: { content: types.map((option) => option.label).join(", ") },
          units: { content: summary.totalCount },
          amiRange: { content: amiRange && formatRange(amiRange.min, amiRange.max, "", "%") },
          rentRange: { content: formatRentRange(rentRange, percentIncomeRange) },
          occupancyRange: {
            content: formatRange(summary.minOccupancy, summary.maxOccupancy, "", ""),
          },
          sqFeetRange: { content: formatRange(summary.sqFeetMin, summary.sqFeetMax, "", "") },
          bathRange: { content: formatRange(summary.bathroomMin, summary.bathroomMax, "", "") },
          action: {
            content: (
              <div className="flex-col">
                <Button
                  type="button"
                  className="front-semibold uppercase m-1"
                  onClick={() => editSummary(summary.tempId)}
                  unstyled
                >
                  {t("t.edit")}
                </Button>
                <Button
                  type="button"
                  className="front-semibold uppercase text-red-700 m-1"
                  onClick={() => setSummaryDeleteModal(summary.tempId)}
                  unstyled
                >
                  {t("t.delete")}
                </Button>
              </div>
            ),
          },
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
        <GridSection columns={3} className={"pb-10"}>
          <ViewItem label={t("listings.homeType")}>
            <Select
              id="homeType"
              name="homeType"
              label={t("listings.homeType")}
              defaultValue={listing?.homeType}
              labelClassName="sr-only"
              register={register}
              controlClassName="control"
              options={["", ...Object.values(HomeTypeEnum)]}
              keyPrefix="homeType"
            />
          </ViewItem>
        </GridSection>
        <p className="field-label">{t("listings.unit.unitGroups")}</p>
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
            id="addUnitsButton"
            type="button"
            size={AppearanceSizeType.normal}
            styleType={fieldHasError(errors?.unitsSummaries) ? AppearanceStyleType.alert : null}
            onClick={() => {
              editSummary(unitsSummaries.length + 1)
              clearErrors("unitsSummaries")
            }}
            dataTestId="addUnitsButton"
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
      <GridSection columns={3} className={"flex items-center"}>
        <GridCell>
          <p className="field-label m-8 mb-2 ml-0">{t("listings.section8AcceptanceQuestion")}</p>
          <FieldGroup
            name="section8Choice"
            type="radio"
            register={register}
            fields={[
              {
                ...yesNoRadioOptions[0],
                id: "section8AcceptanceYes",
                defaultChecked: listing && listing.section8Acceptance === true,
              },
              {
                ...yesNoRadioOptions[1],
                id: "section8AcceptanceNo",
                defaultChecked: listing && listing.section8Acceptance === false,
              },
            ]}
          />
        </GridCell>
      </GridSection>
    </>
  )
}

export default FormUnits
