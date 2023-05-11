import { Listing } from "../../types"

/*
  This may not strictly be needed anymore, as the original implementation
  returned a null literal rather than the string "null", which is what
  JSON.stringify itself returns for a null value.  This behavior was changed
  due to some inserts being rejected for a NOT NULL constraint on some fields.
  Those fields have since been updated in the table, but since the unmarshalling
  behavor of JSON.parse converts the string "null" into a null literal, there's
  no immediate need to change it back.  This function remains to provide a thin
  layer of abstraction over the serialization of objects.

  JSON.stringify takes type `any`, but we use `unknown` to avoid linter errors
*/
export function jsonOrNull(value: unknown): string | null {
  if (value == null) return "null"

  return JSON.stringify(value)
}

function toNumber(val: string | number, fallback: number) {
  // ignore invalid values
  if (val == undefined || val == null) return fallback

  // if it's a number, just use that
  if (typeof val == "number") return val

  if (typeof val == "string") {
    // try to convert it to a number
    const num = parseInt(val)

    // if we can't parse it, fall back
    if (isNaN(num)) return fallback

    // otherwise, return the parsed value
    return num
  }

  // shouldn't happen, but just in case
  return fallback
}

/**
 * Iterates through an array of objects and return the largest value for a
 * chosen property
 *
 * @param units
 * @param prop
 * @returns
 */
export function getUnitPropMaxValue(units: object[], propName: string): number {
  let max = 0

  // skip if not a valid array with items
  if (!Array.isArray(units) || units.length == 0) return 0

  units.forEach((unit) => {
    // extract a numeric value, falling back to max if we can't convert
    const val = toNumber(unit[propName], max)

    // set a new max if this one is larger
    if (val > max) {
      max = val
    }
  })

  return max
}

/**
 * Iterates through an array of objects and return the smallest value for a
 * chosen property
 *
 * @param units
 * @param prop
 * @returns
 */
export function getUnitPropMinValue(units: object[], propName: string) {
  // we have to set min high at first so we can set a real value
  const minInit = 99999
  let min = minInit

  // skip if not a valid array with items
  if (!Array.isArray(units) || units.length == 0) return 0

  units.forEach((unit) => {
    // extract a numeric value, falling back to max if we can't convert
    const val = toNumber(unit[propName], min)

    // set a new max if this one is larger
    if (val < min) {
      min = val
    }
  })

  // if min is still at the original value, no other values were found
  // return a zero instead (?)
  // not sure the best default
  if (min == minInit) {
    return 0
  }

  return min
}

export type ResolveFunction = (listing: Listing) => string | number | boolean | null
export type MapValue = string | ResolveFunction
export type RecordMap = Record<string, MapValue>
export type RecordValue = string | number | boolean | object

export const defaultMap: RecordMap = {
  id: "id",
  assets: (listing: Listing) => jsonOrNull(listing.assets),
  units_available: "unitsAvailable",
  application_due_date: "applicationDueDate",
  application_open_date: "applicationOpenDate",
  name: "name",
  waitlist_current_size: "waitlistCurrentSize",
  waitlist_max_size: "waitlistMaxSize",
  is_waitlist_open: "isWaitlistOpen", // not available on view=base but needed for sorting
  status: "status",
  review_order_type: "reviewOrderType",
  published_at: "publishedAt",
  closed_at: "closedAt",
  updated_at: "updatedAt", // not available on view=base but needed for sorting

  //county: "countyCode",
  //city: (listing: Listing) => listing.buildingAddress?.city,
  neighborhood: (listing: Listing) => listing.neighborhood,
  reserved_community_type_name: (listing: Listing) => listing.reservedCommunityType?.name,

  // Fields for filtering on unit data
  min_monthly_rent: (listing: Listing) => getUnitPropMinValue(listing.units, "monthlyRent"),
  max_monthly_rent: (listing: Listing) => getUnitPropMaxValue(listing.units, "monthlyRent"),
  min_bedrooms: (listing: Listing) => getUnitPropMinValue(listing.units, "numBedrooms"),
  max_bedrooms: (listing: Listing) => getUnitPropMaxValue(listing.units, "numBedrooms"),
  min_bathrooms: (listing: Listing) => getUnitPropMinValue(listing.units, "numBathrooms"),
  max_bathrooms: (listing: Listing) => getUnitPropMaxValue(listing.units, "numBathrooms"),
  min_monthly_income_min: (listing: Listing) =>
    getUnitPropMinValue(listing.units, "monthlyIncomeMin"),
  max_monthly_income_min: (listing: Listing) =>
    getUnitPropMaxValue(listing.units, "monthlyIncomeMin"),
  min_occupancy: (listing: Listing) => getUnitPropMinValue(listing.units, "minOccupancy"),
  max_occupancy: (listing: Listing) => getUnitPropMaxValue(listing.units, "maxOccupancy"),
  min_sq_feet: (listing: Listing) => getUnitPropMinValue(listing.units, "sqFeet"),
  max_sq_feet: (listing: Listing) => getUnitPropMaxValue(listing.units, "sqFeet"),
  lowest_floor: (listing: Listing) => getUnitPropMinValue(listing.units, "floor"),
  highest_floor: (listing: Listing) => getUnitPropMaxValue(listing.units, "floor"),

  url_slug: "urlSlug",

  units_summarized: (listing: Listing) => jsonOrNull(listing.unitsSummarized),
  images: (listing: Listing) => jsonOrNull(listing.images),
  multiselect_questions: (listing: Listing) => jsonOrNull(listing.listingMultiselectQuestions),
  jurisdiction: (listing: Listing) => jsonOrNull(listing.jurisdiction),
  reserved_community_type: (listing: Listing) => jsonOrNull(listing.reservedCommunityType),
  units: (listing: Listing) => jsonOrNull(listing.units),
  building_address: (listing: Listing) => {
    const address = listing.buildingAddress

    // if we don't have an address, ignore
    if (!address) return

    if (!address?.county) {
      const jurisdiction = listing.jurisdiction

      switch (jurisdiction.name) {
        case "San Jose":
          address.county = "Santa Clara"
          break
        case "Alameda":
          address.county = "Alameda"
          break
        case "San Mateo":
          address.county = "San Mateo"
          break
        default:
          address.county = jurisdiction.name
      }
    }

    return jsonOrNull(address)
  },
  features: (listing: Listing) => jsonOrNull(listing.features),
  utilities: (listing: Listing) => jsonOrNull(listing.utilities),
}
