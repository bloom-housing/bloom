import React, { useMemo } from "react"
import { Heading } from "@bloom-housing/ui-seeds"
import { StackedTable, t } from "@bloom-housing/ui-components"
import {
  EnumListingListingType,
  Listing,
  ReviewOrderTypeEnum,
  UnitSummary,
  UnitsSummarized,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import {
  getStackedUnitSummaryDetailsTable,
  getUnitGroupSummariesTable,
} from "@bloom-housing/shared-helpers"
import styles from "./RentSummary.module.scss"
import Markdown from "markdown-to-jsx"

type RentSummaryProps = {
  amiValues: number[]
  reviewOrderType: ReviewOrderTypeEnum
  unitsSummarized: UnitsSummarized
  section8Acceptance: boolean
  listing: Listing
}

const unitSummariesHaveMinimumIncome = (summaries?: UnitSummary[]) =>
  summaries?.some(
    (summary) => summary.minIncomeRange?.min !== "t.n/a" || summary.minIncomeRange?.max !== "t.n/a"
  ) ?? false

export const RentSummary = ({
  amiValues,
  reviewOrderType,
  unitsSummarized,
  section8Acceptance,
  listing,
}: RentSummaryProps) => {
  const { headers, data: unitGroupSummariesData } = getUnitGroupSummariesTable(listing)

  const hasData = !!listing?.unitGroups?.length || !!listing?.units?.length

  const rentTable = useMemo(() => {
    const hasMinimumIncome =
      amiValues.length > 1
        ? !!unitsSummarized?.byAMI?.some((item) => unitSummariesHaveMinimumIncome(item.byUnitType))
        : unitSummariesHaveMinimumIncome(unitsSummarized?.byUnitTypeAndRent)
    const hideMinimumIncome =
      listing.listingType === EnumListingListingType.landUse && !hasMinimumIncome

    const unitSummariesHeaders = {
      unitType: "t.unitType",
      ...(!hideMinimumIncome ? { minimumIncome: "t.minimumIncome" } : {}),
      rent: "t.rent",
      availability: "t.availability",
    }

    if (amiValues.length === 1) {
      return (
        <StackedTable
          headers={unitSummariesHeaders}
          stackedData={getStackedUnitSummaryDetailsTable(
            unitsSummarized.byUnitTypeAndRent,
            reviewOrderType
          )}
        />
      )
    }

    if (amiValues.length > 1) {
      return amiValues.map((percent) => {
        const byAMI = unitsSummarized.byAMI.find((item) => {
          return parseInt(item.percent, 10) === percent
        })

        const groupedUnits = byAMI
          ? getStackedUnitSummaryDetailsTable(byAMI.byUnitType, reviewOrderType)
          : []

        return (
          <React.Fragment key={percent}>
            <Heading size={"md"} priority={3} className={"seeds-m-bs-content"}>
              {t("listings.percentAMIUnit", { percent: percent })}
            </Heading>
            <div className={"seeds-m-bs-header"}>
              <StackedTable headers={unitSummariesHeaders} stackedData={groupedUnits} />
            </div>
          </React.Fragment>
        )
      })
    }

    if (unitGroupSummariesData) {
      return <StackedTable headers={headers} stackedData={unitGroupSummariesData} />
    }
  }, [
    amiValues,
    headers,
    reviewOrderType,
    unitGroupSummariesData,
    listing.listingType,
    unitsSummarized?.byAMI,
    unitsSummarized?.byUnitTypeAndRent,
  ])

  if (!hasData) return null

  return (
    <div className={styles["rent-summary"]}>
      <Heading size={"lg"} className={"seeds-m-be-header"} priority={2}>
        {t("t.rent")}
      </Heading>
      {rentTable}
      {section8Acceptance && (
        <div className={"seeds-p-bs-4"}>
          <Markdown>{t("listings.section8VoucherInfo")}</Markdown>
        </div>
      )}
      <p className={`seeds-p-bs-4`}>{t("listings.amiDisclaimer")}</p>
    </div>
  )
}
