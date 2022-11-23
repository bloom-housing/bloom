import React, { useContext, useMemo } from "react"
import { t, GridSection, MinimalTable, ViewItem, GridCell } from "@bloom-housing/ui-components"
import { ListingContext } from "../../ListingContext"
import { UnitDrawer } from "../DetailsUnitDrawer"
import { MinMax, MonthlyRentDeterminationType } from "@bloom-housing/backend-core/types"
import { minMaxFinder, formatRange, formatRentRange } from "@bloom-housing/shared-helpers"

type DetailUnitsProps = {
  setUnitDrawer: (unit: UnitDrawer) => void
}

const DetailUnits = ({ setUnitDrawer }: DetailUnitsProps) => {
  const listing = useContext(ListingContext)

  const unitTableHeaders = {
    unitType: "listings.unit.type",
    units: "listings.unitsSummary.numUnits",
    amiRange: "listings.unitsSummary.amiRange",
    rentRange: "listings.unitsSummary.rentRange",
    occupancyRange: "listings.unitsSummary.occupancyRange",
    sqFeetRange: "listings.unitsSummary.sqftRange",
    bathRange: "listings.unitsSummary.bathRange",
    action: "",
  }

  const unitTableData = useMemo(
    () =>
      listing?.unitGroups.map((unit) => {
        const types = unit.unitType.map((type) => {
          return t(`listings.unitsSummary.${type.name}`)
        })

        let amiRange: MinMax, rentRange: MinMax, percentIncomeRange: MinMax
        unit?.amiLevels?.forEach((ami) => {
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
          unitType: { content: types.join(", ") },
          units: { content: unit.totalCount },
          amiRange: { content: amiRange && formatRange(amiRange.min, amiRange.max, "", "%") },
          rentRange: { content: formatRentRange(rentRange, percentIncomeRange) },
          occupancyRange: { content: formatRange(unit.minOccupancy, unit.maxOccupancy, "", "") },
          sqFeetRange: { content: formatRange(unit.sqFeetMin, unit.sqFeetMax, "", "") },
          bathRange: { content: formatRange(unit.bathroomMin, unit.bathroomMax, "", "") },
          action: { content: null },
        }
      }),
    [listing, setUnitDrawer]
  )

  return (
    <>
      <GridSection
        className="bg-primary-lighter"
        title={t("listings.units")}
        grid={false}
        tinted
        inset
      >
        <GridSection columns={3} className="pb-8">
          <GridCell>
            <ViewItem label={t("listings.homeType")}>
              {listing.homeType ? t(`homeType.${listing.homeType}`) : t("t.none")}
            </ViewItem>
          </GridCell>
        </GridSection>
        <ViewItem label={t("listings.unit.unitGroups")}>
          {listing.unitGroups.length ? (
            <MinimalTable
              flushLeft
              id="unitTable"
              headers={unitTableHeaders}
              data={unitTableData}
            />
          ) : (
            t("t.none")
          )}
        </ViewItem>
        {listing.section8Acceptance !== null && (
          <GridSection columns={3} className="pt-8">
            <GridCell>
              <ViewItem label={t("listings.section8AcceptanceQuestion")}>
                {listing.section8Acceptance ? t("t.yes") : t("t.no")}
              </ViewItem>
            </GridCell>
          </GridSection>
        )}
      </GridSection>
    </>
  )
}

export { DetailUnits as default, DetailUnits }
