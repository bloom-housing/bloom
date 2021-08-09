import { importListing } from "./listings-importer"
import axios from "axios"
import { Listing } from "../src/listings/entities/listing.entity"
import { Property } from "../src/property/entities/property.entity"
import { Address } from "../src/shared/entities/address.entity"
import { CountyCode } from "../src/shared/types/county-code"
import { CSVFormattingType } from "../src/csv/types/csv-formatting-type-enum"
import { UnitStatus } from "../src/units/types/unit-status-enum"

// Sample usage:
// $ yarn ts-node scripts/import-listings-from-detroit-arcgis.ts http://localhost:3100 test@example.com:abcdef https://services2.arcgis.com/qvkbeam7Wirps6zC/ArcGIS/rest/services/Affordable_Housing_Website_data_12_20/FeatureServer/0//query

function createUnitsArray(type, number) {
  const units = []
  for (let unit_index = 0; unit_index < number; unit_index++) {
    units.push({
      unitType: type,

      status: UnitStatus.unknown,

      // This amiPercentage is made up.
      amiPercentage: "30",

      amiChart: {
        name: "Fake AMI Chart Name",
        items: [],

        // Add null id, createdAt, etc. to avoid compilation errors.
        // (These will be replaced by real values when the script uploads/de-dupes this amiChart.)
        id: null,
        createdAt: null,
        updatedAt: null,
        units: null,
      },

      // Add null id, createdAt, etc. to avoid compilation errors.
      // (These will be replaced by real values when the script uploads this unit.)
      id: null,
      createdAt: null,
      updatedAt: null,
      property: null,
    })
  }
  return units
}

async function main() {
  if (process.argv.length < 5) {
    console.log(
      "usage: yarn ts-node scripts/import-listings-from-detroit-arcgis.ts import_api_url email:password arcgis_url"
    )
    process.exit(1)
  }

  const [importApiUrl, userAndPassword, arcGisUrl] = process.argv.slice(2)
  const [email, password] = userAndPassword.split(":")

  const response = await axios.get(arcGisUrl, {
    params: { where: "1=1", f: "pjson", outFields: "*" },
  })

  const numListings: number = response.data.features.length
  for (let i = 0; i < numListings; i++) {
    const listingAttributes = response.data.features[i].attributes

    const listing = new Listing()
    const property = new Property()
    const address = new Address()

    address.street = listingAttributes.Project_Address
    address.latitude = listingAttributes.Latitude
    address.longitude = listingAttributes.Longitude
    address.zipCode = listingAttributes.Zip
    address.city = "Detroit"
    address.state = "MI"

    property.buildingAddress = address
    property.neighborhood = listingAttributes.Neighborhood
    property.unitsAvailable = parseInt(listingAttributes.Affordable_Units)

    property.units = []
    if (listingAttributes.Number_0BR) {
      property.units = property.units.concat(
        createUnitsArray("studio", listingAttributes.Number_0BR)
      )
    }
    if (listingAttributes.Number_1BR) {
      property.units = property.units.concat(
        createUnitsArray("oneBdrm", parseInt(listingAttributes.Number_1BR))
      )
    }
    if (listingAttributes.Number_2BR) {
      property.units = property.units.concat(
        createUnitsArray("twoBdrm", parseInt(listingAttributes.Number_2BR))
      )
    }
    if (listingAttributes.Number_3BR) {
      property.units = property.units.concat(
        createUnitsArray("threeBdrm", parseInt(listingAttributes.Number_3BR))
      )
    }
    if (listingAttributes.Number_4BR) {
      property.units = property.units.concat(
        createUnitsArray("fourBdrm", parseInt(listingAttributes.Number_4BR))
      )
    }
    if (listingAttributes.Number_5BR) {
      property.units = property.units.concat(
        createUnitsArray("fiveBdrm", parseInt(listingAttributes.Number_5BR))
      )
    }

    // The /listings/id view won't render if there isn't at least one unit; add a dummy "studio"
    if (property.units.length == 0) {
      property.units = createUnitsArray("studio", 1)
    }

    listing.property = property
    listing.name = listingAttributes.Project_Name
    listing.leasingAgentName = listingAttributes.Manager_Contact

    if (listingAttributes.Manager_Phone) {
      listing.leasingAgentPhone = listingAttributes.Manager_Phone
    } else if (listingAttributes.Property_Phone) {
      listing.leasingAgentPhone = listingAttributes.Property_Phone
    } else {
      listing.leasingAgentPhone = "(555) 555-5555"
    }

    listing.leasingAgentAddress = {
      city: "Fake City",
      state: "XX",
      street: "123 Fake St",
      zipCode: "12345",

      // Add null id, createdAt, etc. to avoid compilation errors.
      // (These will be replaced by real values when the script uploads this address.)
      id: null,
      createdAt: null,
      updatedAt: null,
    }

    listing.preferences = []
    listing.assets = []
    listing.applicationMethods = []
    listing.events = []
    listing.CSVFormattingType = CSVFormattingType.basic
    listing.countyCode = CountyCode.detroit
    listing.displayWaitlistSize = false

    try {
      const newListing = await importListing(importApiUrl, email, password, listing)
      console.log("New listing (" + newListing.name + ") created successfully.")
    } catch (e) {
      console.log(e)
      process.exit(1)
    }
  }
  console.log("\nSuccessfully created all " + numListings.toString() + " listings!")
}

void main()
