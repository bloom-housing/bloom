import React, { useContext, useMemo } from "react"
import { t, GridSection, MinimalTable } from "@bloom-housing/ui-components"
import { ListingContext } from "../../ListingContext"
import { UnitDrawer } from "../DetailsUnitDrawer"
import { MonthlyRentDeterminationType } from "@bloom-housing/backend-core/types"

type DetailUnitsProps = {
  setUnitDrawer: (unit: UnitDrawer) => void
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

  const commaHelper = (rent, percent) => {
    if (rent !== undefined && percent !== undefined) {
      return ", "
    }
    return ""
  }

  const unitTableData = useMemo(
    () =>
      listing?.unitGroups.map((unit) => {
        const types = unit.unitType.map((type) => {
          return t(`listings.unitsSummary.${type.name}`)
        })
        let amiRange = [undefined, undefined]
        let rentRange = [undefined, undefined]
        let percentIncomeRange = [undefined, undefined]
        unit?.amiLevels?.forEach((ami) => {
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
          if (
            ami.flatRentValue &&
            ami.monthlyRentDeterminationType === MonthlyRentDeterminationType.flatRent
          ) {
            if (rentRange[0] === undefined) {
              rentRange[0] = ami.flatRentValue
              rentRange[1] = ami.flatRentValue
            }
            if (ami.flatRentValue < rentRange[0]) {
              rentRange[0] = ami.flatRentValue
            } else if (ami.flatRentValue > rentRange[1]) {
              rentRange[1] = ami.flatRentValue
            }
          }
          if (
            ami.percentageOfIncomeValue &&
            ami.monthlyRentDeterminationType === MonthlyRentDeterminationType.percentageOfIncome
          ) {
            if (percentIncomeRange[0] === undefined) {
              percentIncomeRange[0] = ami.percentageOfIncomeValue
              percentIncomeRange[1] = ami.percentageOfIncomeValue
            }
            if (ami.percentageOfIncomeValue < percentIncomeRange[0]) {
              percentIncomeRange[0] = ami.percentageOfIncomeValue
            } else if (ami.percentageOfIncomeValue > percentIncomeRange[1]) {
              percentIncomeRange[1] = ami.percentageOfIncomeValue
            }
          }
        })
        if (amiRange[0] !== undefined) {
          amiRange.sort((a, b) => a - b)
        }
        if (rentRange[0] !== undefined) {
          rentRange.sort((a, b) => a - b)
        }
        if (percentIncomeRange[0] !== undefined) {
          percentIncomeRange.sort((a, b) => a - b)
        }
        return {
          unitType: types.join(", "),
          units: unit.totalCount,
          amiRange: formatRange(amiRange[0], amiRange[1], "", "%"),
          rentRange: `${formatRange(rentRange[0], rentRange[1], "$", "")}${commaHelper(
            rentRange[0],
            percentIncomeRange[0]
          )}${formatRange(percentIncomeRange[0], percentIncomeRange[1], "", "%")}`,
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
