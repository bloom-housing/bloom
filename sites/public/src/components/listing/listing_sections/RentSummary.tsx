import * as React from "react"
import { Heading } from "@bloom-housing/ui-seeds"
import { StackedTable, t } from "@bloom-housing/ui-components"
import {
  Listing,
  ReviewOrderTypeEnum,
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

export const RentSummary = ({
  amiValues,
  reviewOrderType,
  unitsSummarized,
  section8Acceptance,
  listing,
}: RentSummaryProps) => {
  const unitSummariesHeaders = {
    unitType: "t.unitType",
    minimumIncome: "t.minimumIncome",
    rent: "t.rent",
    availability: "t.availability",
  }

  const { headers, data: unitGroupSummariesData } = getUnitGroupSummariesTable(listing)

  return (
    <div className={styles["rent-summary"]}>
      <Heading size={"lg"} className={"seeds-m-be-header"} priority={2}>
        {t("t.rent")}
      </Heading>
      {amiValues.length > 1 &&
        amiValues.map((percent) => {
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
        })}
      {unitGroupSummariesData && (
        <StackedTable headers={headers} stackedData={unitGroupSummariesData} />
      )}

      {amiValues.length === 1 && (
        <StackedTable
          headers={unitSummariesHeaders}
          stackedData={getStackedUnitSummaryDetailsTable(
            unitsSummarized.byUnitTypeAndRent,
            reviewOrderType
          )}
        />
      )}
      {section8Acceptance && <Markdown>{t("listings.section8VoucherInfo")}</Markdown>}
    </div>
  )
}
