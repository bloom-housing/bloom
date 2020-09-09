import * as client from "./client"
import axios from "axios"
import { serviceOptions } from "./client"
import fs from "fs"
import { ListingStatus } from "./src/entity/listing.entity"
import { plainToClass } from "class-transformer"
import { ListingDto } from "./src/listings/listing.dto"
import { validate, validateSync } from "class-validator"

// NOTE: unit's monthlyRent, floor and monthlyIncomeMin have been changed to type string
// NOTE: in the DB and unit_transformations lib has been adjusted (verify correctness)

// NOTE: At the moment every logged in user can CRUD all entities since there are no admin role checks

// TODO Backend allows non-whitelisted props despite being configured not to

/* NOTE: housingbayarea/bloom listings data needs follow adjustments:
 *  unit: [ 'floor must be a number conforming to the specified constraints' ]
 *  listing: [ 'postmarkedApplicationsReceivedByDate must be a ISOString' ]
 *  */

if (process.argv.length < 4) {
  console.log("usage: listings-importer api_url email:password input_listing.json")
  process.exit(1)
}

const [apiUrl, userAndPassword, listingFilePath] = process.argv.slice(2)

const instance = axios.create({
  baseURL: apiUrl,
  timeout: 1000,
})

serviceOptions.axios = instance

const assetsService = new client.AssetsService()
const applicatonMethodsService = new client.ApplicationMethodsService()
const unitsService = new client.UnitsService()
const preferencesService = new client.PreferencesService()
const listingsService = new client.ListingsService()
const authService = new client.AuthService()

async function uploadEntity(entityKey, entityService, listing) {
  const newRecordsIds = await Promise.all(
    listing[entityKey].map(async (obj) => {
      try {
        const res = await entityService.create({
          body: obj,
        })
        return { id: res.id }
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

async function uploadListing(listing, listingService) {
  try {
    return await listingsService.create({
      body: listing,
    })
  } catch (e) {
    console.log(listing)
    console.log(e.response.data.message)
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

async function main() {
  const [email, password] = userAndPassword.split(":")
  const { accessToken } = await authService.login({
    body: {
      email: email,
      password: password,
    },
  })

  serviceOptions.axios = axios.create({
    baseURL: apiUrl,
    timeout: 1000,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  let listing = JSON.parse(fs.readFileSync(listingFilePath, "utf-8"))
  const relationsKeys = ["assets", "units", "applicationMethods", "preferences"]
  listing = reformatListing(listing, relationsKeys)
  listing = await uploadEntity("assets", assetsService, listing)
  listing = await uploadEntity("units", unitsService, listing)
  listing = await uploadEntity("applicationMethods", applicatonMethodsService, listing)
  listing = await uploadEntity("preferences", preferencesService, listing)
  const newListing = await uploadListing(listing, listingsService)
  console.log(newListing)
}

main()
