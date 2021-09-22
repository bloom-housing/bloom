import * as client from "../types/src/backend-swagger"
import axios from "axios"
import { ListingCreate, ListingStatus, serviceOptions } from "../types/src/backend-swagger"

// NOTE: This script relies on any logged-in users having permission to create
// listings and properties (defined in backend/core/src/auth/authz_policy.csv)

const preferencesService = new client.PreferencesService()
const listingsService = new client.ListingsService()
const authService = new client.AuthService()
const unitTypesService = new client.UnitTypesService()
const unitAccessibilityPriorityTypesService = new client.UnitAccessibilityPriorityTypesService()
const applicationMethodsService = new client.ApplicationMethodsService()
const reservedCommunityTypesService = new client.ReservedCommunityTypesService()

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

async function uploadReservedCommunityType(data) {
  try {
    return await reservedCommunityTypesService.create({
      body: { name: data },
    })
  } catch (e) {
    console.log(e.response)
    process.exit(1)
  }
}

async function getReservedCommunityType(name) {
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

const findByName = (list, name) => {
  return list.find((el) => el.name === name)
}

export async function importListing(
  apiUrl: string,
  email: string,
  password: string,
  listing: ListingCreate
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

  // Tidy a few of the listing's fields.
  const relationsKeys = []
  listing = reformatListing(listing, relationsKeys)

  // Upload new entities.
  listing = await uploadEntity("preferences", preferencesService, listing)
  listing = await uploadEntity("applicationMethods", applicationMethodsService, listing)
  let reservedCommunityType
  if (listing.reservedCommunityType) {
    reservedCommunityType = await getReservedCommunityType(listing.reservedCommunityType)
    if (!reservedCommunityType) {
      reservedCommunityType = await uploadReservedCommunityType(listing.reservedCommunityType)
    }
  }
  listing.reservedCommunityType = reservedCommunityType

  listing.units.forEach((unit) => {
    unit.priorityType = findByName(priorityTypes, unit.priorityType)
    unit.unitType = findByName(unitTypes, unit.unitType)
  })
  if (listing.unitsSummary) {
    listing.unitsSummary.forEach((summary) => {
      summary.unitType = findByName(unitTypes, summary.unitType)
    })
  }

  // Upload the listing, and then return it.
  return await uploadListing(listing)
}
