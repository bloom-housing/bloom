import * as client from "../client"
import axios from "axios"
import { serviceOptions } from "../client"
import fs from "fs"
import { ListingStatus } from "../src/listings/types/listing-status-enum"

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
  timeout: 10000,
})

serviceOptions.axios = instance

const preferencesService = new client.PreferencesService()
const listingsService = new client.ListingsService()
const propertyService = new client.PropertiesService()
const authService = new client.AuthService()
const amiChartService = new client.AmiChartsService()

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

async function uploadListing(listing) {
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

async function uploadProperty(property) {
  try {
    return await propertyService.create({
      body: property,
    })
  } catch (e) {
    console.log(e.response)
    process.exit(1)
  }
}

async function getAmiChart(name) {
  try {
    const charts = await amiChartService.list()
    return charts.filter((chart) => chart.name === name)[0]
  } catch (e) {
    console.log(e.response)
    process.exit(1)
  }
}

async function uploadAmiChart(data) {
  try {
    return await amiChartService.create({
      body: data,
    })
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
  if (!("countyCode" in listing)) {
    listing.countyCode = "Alameda"
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
    timeout: 10000,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  let listing = JSON.parse(fs.readFileSync(listingFilePath, "utf-8"))
  let property = listing.property
  delete listing.property
  const relationsKeys = []
  listing = reformatListing(listing, relationsKeys)
  listing = await uploadEntity("preferences", preferencesService, listing)

  property.listings = [listing]
  const amiChartName = listing.amiChart.name
  let chart = await getAmiChart(amiChartName)
  if (!chart) {
    chart = await uploadAmiChart(listing.amiChart)
  }

  property.units.forEach((unit) => (unit.amiChart = chart))
  property = await uploadProperty(property)
  listing.property = property

  const newListing = await uploadListing(listing)

  console.log("Success, New Listing: ", newListing)
}

void main()
