import * as client from "../types/src/backend-swagger"
import axios from "axios"
import {
  ListingCreate,
  ListingStatus,
  serviceOptions,
  UnitsSummaryCreate,
  UnitCreate,
} from "../types/src/backend-swagger"

// NOTE: This script relies on any logged-in users having permission to create
// listings and properties (defined in backend/core/src/auth/authz_policy.csv)

const preferencesService = new client.PreferencesService()
const listingsService = new client.ListingsService()
const authService = new client.AuthService()
const unitTypesService = new client.UnitTypesService()
const unitAccessibilityPriorityTypesService = new client.UnitAccessibilityPriorityTypesService()
const applicationMethodsService = new client.ApplicationMethodsService()
const reservedCommunityTypesService = new client.ReservedCommunityTypesService()
const jurisdictionService = new client.JurisdictionsService()

// Create these import interfaces to mimic the format defined in backend-swagger.ts, but allow
// certain fields to have a simpler type. For example: allow listing.units.unitType to be a
// string (e.g. "oneBdrm"), and then the importListing function will look up the corresponding
// unitType object by name and use that unitType object to construct the UnitCreate.
export interface ListingImport
  extends Omit<ListingCreate, "unitsSummary" | "units" | "reservedCommunityType" | "jurisdiction"> {
  unitsSummary?: UnitsSummaryImport[]
  units?: UnitImport[]
  reservedCommunityTypeName?: string
  jurisdictionName?: string
}
export interface UnitsSummaryImport extends Omit<UnitsSummaryCreate, "unitType"> {
  unitType?: string
}
export interface UnitImport extends Omit<UnitCreate, "unitType" | "priorityType"> {
  priorityType?: string
  unitType?: string
}

async function uploadEntity(entityKey, entityService, listing) {
  const newRecordsIds = await Promise.all(
    listing[entityKey].map(async (obj) => {
      try {
        const res = await entityService.create({
          body: obj,
        })
        return res
      } catch (e) {
        console.log(obj)
        console.log(e.response.data.message)
        process.exit(1)
      }
    })
  )
  listing[entityKey] = newRecordsIds
  return listing
}

async function uploadListing(listing: ListingCreate) {
  try {
    return await listingsService.create({
      body: listing,
    })
  } catch (e) {
    console.log(listing)
    throw new Error(e.response.data.message)
  }
}

async function uploadReservedCommunityType(name: string, jurisdictions: client.Jurisdiction[]) {
  try {
    return await reservedCommunityTypesService.create({
      body: {
        name,
        jurisdiction: jurisdictions.find((jurisdiction) => jurisdiction.name == "Detroit"),
      },
    })
  } catch (e) {
    console.log(e.response)
    process.exit(1)
  }
}

async function getReservedCommunityType(name: string) {
  try {
    const reservedTypes = await reservedCommunityTypesService.list()
    return reservedTypes.filter((reservedType) => reservedType.name === name)[0]
  } catch (e) {
    console.log(e.response)
    process.exit(1)
  }
}

function reformatListing(listing, relationsKeys: string[]) {
  relationsKeys.forEach((relation) => {
    if (!(relation in listing) || listing[relation] === null) {
      listing[relation] = []
    } else {
      // Replace nulls with undefined and remove id
      // This is because validation @IsOptional does not allow nulls
      const relationArr = listing[relation]
      for (const obj of relationArr) {
        try {
          delete obj["id"]
        } catch (e) {
          console.error(e)
        }
        for (const key in obj) {
          if (obj[key] === null) {
            delete obj[key]
          }
        }
      }
    }
  })
  if (!("status" in listing)) {
    listing.status = ListingStatus.active
  }
  try {
    delete listing["id"]
  } catch (e) {
    console.error(e)
  }
  return listing
}

const findByName = (list, name: string) => {
  return list.find((el) => el.name === name)
}

export async function importListing(
  apiUrl: string,
  email: string,
  password: string,
  listing: ListingImport
) {
  serviceOptions.axios = axios.create({
    baseURL: apiUrl,
    timeout: 10000,
  })

  // Log in to retrieve an access token.
  const { accessToken } = await authService.login({
    body: {
      email: email,
      password: password,
    },
  })

  // Update the axios config so future requests include the access token in the header.
  serviceOptions.axios = axios.create({
    baseURL: apiUrl,
    timeout: 10000,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  const unitTypes = await unitTypesService.list()
  const priorityTypes = await unitAccessibilityPriorityTypesService.list()
  const jurisdictions = await jurisdictionService.list()

  // Tidy a few of the listing's fields.
  const relationsKeys = []
  listing = reformatListing(listing, relationsKeys)

  // If a managementWebsite is provided, make sure it is a well-formed URL.
  if (listing.managementWebsite) {
    if (!listing.managementWebsite.startsWith("http")) {
      listing.managementWebsite = "http://" + listing.managementWebsite
    }

    // This next line will throw an error if managementWebsite is a malformed URL.
    try {
      new URL(listing.managementWebsite)
    } catch (e) {
      console.log(
        `Error: ${listing.name} has a malformed managementWebsite (${listing.managementWebsite});` +
          ` this website will be discarded and the listing will be uploaded without it.`
      )
      console.log(e)
      listing.managementWebsite = null
    }
  }

  // Upload new entities.
  listing = await uploadEntity("preferences", preferencesService, listing)
  listing = await uploadEntity("applicationMethods", applicationMethodsService, listing)

  // Look up the reserved community type by name, or create it if it doesn't yet exist.
  let reservedCommunityType: client.ReservedCommunityType
  if (listing.reservedCommunityTypeName) {
    reservedCommunityType = await getReservedCommunityType(listing.reservedCommunityTypeName)
    if (!reservedCommunityType) {
      reservedCommunityType = await uploadReservedCommunityType(
        listing.reservedCommunityTypeName,
        jurisdictions
      )
    }
  }

  // Construct the units and unitsSummary arrays expected by the backend, by looking up the
  // unitTypes and priorityTypes referenced by name.
  const unitsCreate: UnitCreate[] = []
  listing.units.forEach((unit) => {
    const priorityType = findByName(priorityTypes, unit.priorityType)
    const unitType = findByName(unitTypes, unit.unitType)
    unitsCreate.push({ ...unit, priorityType: priorityType, unitType: unitType })
  })
  const unitsSummaryCreate: UnitsSummaryCreate[] = []
  if (listing.unitsSummary) {
    listing.unitsSummary.forEach((summary) => {
      const unitType = findByName(unitTypes, summary.unitType)
      unitsSummaryCreate.push({ ...summary, unitType: unitType })
    })
  }

  let jurisdiction: client.Jurisdiction = null
  if (listing.jurisdictionName) {
    jurisdiction = findByName(jurisdictions, listing.jurisdictionName)
  }

  // Construct the ListingCreate to be sent to the backend. Its structure mostly mimics that of the
  // input ListingImport, with the exception of the fields for which we had to look up referenced
  // types.
  const listingCreate: ListingCreate = {
    ...listing,
    unitsSummary: unitsSummaryCreate,
    units: unitsCreate,
    reservedCommunityType: reservedCommunityType,
    jurisdiction: jurisdiction,
  }

  // Upload the listing, and then return it.
  return await uploadListing(listingCreate)
}
