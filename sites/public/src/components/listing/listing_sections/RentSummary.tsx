import * as React from "react"
import { Heading } from "@bloom-housing/ui-seeds"
import { StandardTable, t } from "@bloom-housing/ui-components"
import {
  Listing,
  ReviewOrderTypeEnum,
  UnitsSummarized,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { getSummariesTable, getUnitGroupSummariesTable } from "@bloom-housing/shared-helpers"
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

          const groupedUnits = byAMI ? getSummariesTable(byAMI.byUnitType, reviewOrderType) : []

          return (
            <React.Fragment key={percent}>
              <Heading size={"md"} priority={3} className={"seeds-m-bs-content"}>
                {t("listings.percentAMIUnit", { percent: percent })}
              </Heading>
              <div className={"seeds-m-bs-header"}>
                <StandardTable
                  headers={unitSummariesHeaders}
                  data={groupedUnits}
                  responsiveCollapse={true}
                />
              </div>
            </React.Fragment>
          )
        })}
      {unitGroupSummariesData && (
        <StandardTable headers={headers} data={unitGroupSummariesData} responsiveCollapse={true} />
      )}

      {amiValues.length === 1 && (
        <StandardTable
          headers={unitSummariesHeaders}
          data={getSummariesTable(unitsSummarized.byUnitTypeAndRent, reviewOrderType)}
          responsiveCollapse={true}
        />
      )}
      {section8Acceptance && <Markdown>{t("listings.section8VoucherInfo")}</Markdown>}
    </div>
  )
}
