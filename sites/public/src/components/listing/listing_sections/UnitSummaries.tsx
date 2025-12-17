import React from "react"
import { Unit, UnitSummary } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { StackedTable, t } from "@bloom-housing/ui-components"
import { getStackedUnitTableData } from "@bloom-housing/shared-helpers"
import { ExpandableSection } from "../../../patterns/ExpandableSection"
import { ShowMoreSection } from "../../../patterns/ShowMoreSection"

type UnitSummariesProps = {
  disableUnitsAccordion: boolean
  units: Unit[]
  unitSummary: UnitSummary[]
}

export const UnitSummaries = ({
  disableUnitsAccordion,
  units,
  unitSummary,
}: UnitSummariesProps) => {
  if (!unitSummary?.length) return
  return (
    <>
      {unitSummary.map((summary, index) => {
        const { adjustedHeaders, unitsFormatted, barContent } = getStackedUnitTableData(
          units,
          summary
        )
        return (
          <div
            className={index !== 0 ? "seeds-m-bs-header" : ""}
            key={index}
            data-testid={"listing-unit-summary"}
          >
            <ExpandableSection
              title={barContent}
              priority={4}
              disableCollapse={disableUnitsAccordion || unitsFormatted.length === 0}
              uniqueId={`unit-table-${index}`}
              defaultCollapse={disableUnitsAccordion}
            >
              <ShowMoreSection
                fullContent={
                  <StackedTable headers={adjustedHeaders} stackedData={unitsFormatted} />
                }
                minimizedContent={
                  <StackedTable
                    headers={adjustedHeaders}
                    stackedData={unitsFormatted.slice(0, 3)}
                  />
                }
                showLessAriaLabel={t("listings.unit.showLessUnits", {
                  type: t(`application.household.preferredUnit.options.${summary.unitTypes.name}`),
                })}
                showMoreAriaLabel={t("listings.unit.showMoreUnits", {
                  type: t(`application.household.preferredUnit.options.${summary.unitTypes.name}`),
                })}
                uniqueId={`unit-feature-${index}`}
                disableShowMore={unitsFormatted.length <= 3}
              />
            </ExpandableSection>
          </div>
        )
      })}
    </>
  )
}
