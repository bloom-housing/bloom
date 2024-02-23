/* eslint-disable @typescript-eslint/no-explicit-any */
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

// TODO: add typing back to this RecordMap
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

  neighborhood: (listing: Listing) => listing.neighborhood,
  reserved_community_type_name: (listing: any) =>
    listing.reservedCommunityType?.name || listing.reservedCommunityTypes?.name,

  url_slug: "urlSlug",

  units_summarized: (listing: any) => {
    const listingData = listing.unitsSummarized
    if (listingData?.byUnitTypeAndRent) {
      listingData.byUnitTypeAndRent.forEach((elem) => {
        if (elem.unitTypes) {
          elem.unitType = elem.unitTypes
        }
      })
    }
    if (listingData?.byUnitType) {
      listingData.byUnitType.forEach((elem) => {
        if (elem.unitTypes) {
          elem.unitType = elem.unitTypes
        }
      })
    }
    if (listingData?.byAMI) {
      listingData.byAMI.forEach((byAmi) => {
        if (byAmi?.byUnitType) {
          byAmi?.byUnitType.forEach((elem) => {
            if (elem.unitTypes) {
              elem.unitType = elem.unitTypes
            }
          })
        }
      })
    }

    return jsonOrNull(listingData)
  },
  images: (listing: any) => {
    let listingImageData = listing.images
    if (listing.listingImages) {
      listingImageData = listing.listingImages
      // `assets` (type: Asset) has to be mapped to `images` (type: AssetUpdateDto)
      listingImageData.forEach((image, index) => {
        listingImageData[index].image = image.assets
      })
    }
    return jsonOrNull(listingImageData)
  },
  multiselect_questions: (listing: any) => {
    if (!listing.listingMultiselectQuestions) {
      return jsonOrNull(listing.listingMultiselectQuestions)
    }
    const listingData = listing.listingMultiselectQuestions.map((elem) => {
      if (elem.multiselectQuestion) {
        // if its a listing with typeorm data
        return elem
      } else {
        // if its a listing with prisma data
        return {
          ...elem,
          multiselectQuestion: elem.multiselect_questions,
        }
      }
    })

    return jsonOrNull(listingData)
  },
  jurisdiction: (listing: any) => jsonOrNull(listing.jurisdiction || listing.jurisdictions),
  reserved_community_type: (listing: any) =>
    jsonOrNull(listing.reservedCommunityType || listing.reservedCommunityTypes),
  units: (listing: any) => {
    const units = listing.units

    // Add numeric values for some string fields
    if (Array.isArray(units)) {
      units.forEach((unit) => {
        // Convert all of these properties to numeric values
        ;[
          "monthlyRent",
          "sqFeet",
          "monthlyIncomeMin",
          "annualIncomeMin",
          "annualIncomeMax",
          "amiPercentage",
          "monthlyRentAsPercentOfIncome",
        ].forEach((propName) => {
          if (propName in unit && typeof unit[propName] == "string") {
            const numVal = parseFloat(unit[propName] as string)

            // Create a new property name for the numeric value based on the old one
            // eg monthlyRent -> numMonthlyRent
            const newPropName = "num" + propName[0].toUpperCase() + propName.slice(1)

            // Set the new value but retain the old one
            unit[newPropName] = isNaN(numVal) ? null : numVal
          }
        })

        // convert from prisma to typeorm
        if (unit.unitTypes) {
          unit.unitType = unit.unitTypes
        }
        if (unit.unitRentTypes) {
          unit.unitRentType = unit.unitRentTypes
        }
        if (unit.unitAccessibilityPriorityTypes) {
          unit.priorityType = unit.unitAccessibilityPriorityTypes
        }
        if (unit.unitAmiChartOverrides) {
          unit.amiChartOverride = unit.unitAmiChartOverrides
        }
      })
    }

    return jsonOrNull(units)
  },
  building_address: (listing: any) => {
    const address = listing.buildingAddress || listing.listingsBuildingAddress

    // if we don't have an address, ignore
    if (!address) return

    if (!address?.county) {
      const jurisdiction = listing.jurisdiction || listing.jurisdictions

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
  features: (listing: any) => jsonOrNull(listing.features || listing.listingFeatures),
  utilities: (listing: any) => jsonOrNull(listing.utilities || listing.listingUtilities),
}
