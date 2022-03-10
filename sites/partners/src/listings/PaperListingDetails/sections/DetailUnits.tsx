import React, { useContext, useMemo } from "react"
import { t, GridSection, MinimalTable } from "@bloom-housing/ui-components"
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
          unitType: types.join(", "),
          units: unit.totalCount,
          amiRange: amiRange && formatRange(amiRange.min, amiRange.max, "", "%"),
          rentRange: formatRentRange(rentRange, percentIncomeRange),
          occupancyRange: formatRange(unit.minOccupancy, unit.maxOccupancy, "", ""),
          sqFeetRange: formatRange(unit.sqFeetMin, unit.sqFeetMax, "", ""),
          bathRange: formatRange(unit.bathroomMin, unit.bathroomMax, "", ""),
          action: null,
        }
      }),
    [listing, setUnitDrawer]
  )

  return (
    <GridSection
      className="bg-primary-lighter"
      title={t("listings.units")}
      grid={false}
      tinted
      inset
    >
      {listing.unitGroups.length ? (
        <MinimalTable id="unitTable" headers={unitTableHeaders} data={unitTableData} />
      ) : (
        <span className="text-base font-semibold pt-4">{t("t.none")}</span>
      )}
    </GridSection>
  )
}

export { DetailUnits as default, DetailUnits }
