import * as client from "../types/src/backend-swagger"
import axios from "axios"
import { ListingCreate, ListingStatus, serviceOptions } from "../types/src/backend-swagger"
import { UnitStatus } from "../src/units/types/unit-status-enum"

// NOTE: This script relies on any logged-in users having permission to create
// listings and properties (defined in backend/core/src/auth/authz_policy.csv)

export function createUnitsArray(type: string, number: number) {
  const units = []
  for (let unit_index = 0; unit_index < number; unit_index++) {
    units.push({
      unitType: type,
      status: UnitStatus.unknown,
    })
  }
  return units
}

function uploadPreferences(listing) {
  const preferencesService = new client.PreferencesService()
  listing.preferences.map(async (preference) => {
    try {
      return await preferencesService.create({
        body: preference,
      })
    } catch (e) {
      console.log(preference)
      console.log(e.response.data.message)
      process.exit(1)
    }
  })
}

async function uploadListing(listing: ListingCreate) {
  try {
    const listingsService = new client.ListingsService()
    return await listingsService.create({
      body: listing,
    })
  } catch (e) {
    throw new Error(e.response.data.message)
  }
}

async function uploadAmiCharts(units) {
  const amiChartService = new client.AmiChartsService()
  const charts = await amiChartService.list()

  for (const unit of units) {
    const chartFromUnit = unit.amiChart
    if (!chartFromUnit) {
      continue
    }

    // Look for the chart by name.
    let chart = charts.filter((chart) => chart.name == chartFromUnit.name)[0]

    // If it doesn't exist, create it.
    if (!chart) {
      chart = await amiChartService.create({ body: chartFromUnit })
    }
    unit.amiChart = chart
  }
}

async function linkToUnitTypes(units) {
  const unitTypesService = new client.UnitTypesService()
  const unitTypes = await unitTypesService.list()

  for (const unit of units) {
    const unitTypeStr = unit.unitType
    if (!unitTypeStr) {
      throw new Error("Each unit must have a unitType.")
    }

    // Look for the unitType by name.
    const unitType = unitTypes.filter((unitType) => unitType.name == unitTypeStr)[0]

    // If it doesn't exist, throw an error.
    if (!unitType) {
      throw new Error(`No unit type with name "${unitTypeStr}" found`)
    }
    unit.unitType = unitType
  }
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
  const authService = new client.AuthService()
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

  // Tidy a few of the listing's fields.
  if (!listing.status) {
    listing.status = ListingStatus.active
  }
  delete listing["id"]

  // Create corresponding preferences (if any).
  if (listing.preferences) {
    uploadPreferences(listing)
  }

  await uploadAmiCharts(listing.units)

  // Replace each unit's unitType string with a foreign-key reference to the corresponding row in
  // the unit_types table.
  await linkToUnitTypes(listing.units)

  // Upload the listing, and then return it.
  return await uploadListing(listing)
}
