/* eslint-disable  @typescript-eslint/no-explicit-any */
import { Listing } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

export const listingsUrl = "http://127.0.0.1:3100/listings?limit=all"

type GetIncomeReturn = {
  monthlyMin: number
  monthlyMax: number
  annualMin: number
  annualMax: number
} | null

type ApplyConfigUpdatesProps = {
  config: Record<string, any>
  listing: Listing
}

type UpdatePreferredUnitsProps = ApplyConfigUpdatesProps

export const setProperty = (
  obj: Record<string, any>,
  replacePath: string | string[],
  value: any
) => {
  if (Object(obj) !== obj) return obj

  let path: string[] = []

  if (!Array.isArray(replacePath)) path = replacePath.toString().match(/[^.[\]]+/g) || []

  path
    .slice(0, -1)
    .reduce(
      (a, c, i) =>
        Object(a[c]) === a[c]
          ? a[c]
          : (a[c] = Math.abs(+path[i + 1]) >> 0 === +path[i + 1] ? [] : {}),
      obj
    )[path[path.length - 1]] = value
  return obj
}

export const getListingIncome = (): GetIncomeReturn => {
  const listing = sessionStorage.getItem("bloom-app-listing")

  if (!listing) return null

  const listingObj: Listing = JSON.parse(listing)

  const { units } = listingObj

  const [annualMin, annualMax, monthlyMin] =
    units &&
    units.reduce(
      ([aMin, aMax, mMin], unit) => [
        Math.min(aMin, parseFloat(unit.annualIncomeMin || "0.0")),
        Math.max(aMax, parseFloat(unit.annualIncomeMax || "0.0")),
        Math.min(mMin, parseFloat(unit.monthlyIncomeMin || "0.0")),
      ],
      [Infinity, 0, Infinity]
    )
  const monthlyMax = annualMax / 12.0

  return {
    monthlyMin: parseFloat(monthlyMin.toFixed(2)),
    monthlyMax: parseFloat(monthlyMax.toFixed(2)),
    annualMin: parseFloat(annualMin.toFixed(2)),
    annualMax: parseFloat(annualMax.toFixed(2)),
  }
}

export const updatePreferredUnits = ({ config, listing }: UpdatePreferredUnitsProps) => {
  const firstUnitType = listing.units[0].unitTypes
  config.preferredUnit = [{ id: firstUnitType?.id }]

  return config
}

export const applyConfigUpdates = ({ config, listing }: ApplyConfigUpdatesProps) => {
  // unit types are related to the listing preferred_unit using Id, to test submission it needs to be updated
  updatePreferredUnits({
    config,
    listing,
  })
}
