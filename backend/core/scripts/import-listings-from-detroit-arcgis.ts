import { importListing } from "./listings-importer"
import moment from "moment"
import Listing from "../src/listings/entities/listing.entity"
import { Property } from "../src/property/entities/property.entity"
import { Address } from "../src/shared/entities/address.entity"
import { CountyCode } from "../src/shared/types/county-code"
import { CSVFormattingType } from "../src/csv/types/csv-formatting-type-enum"

// Sample usage:
// $ yarn ts-node scripts/import-listings-from-detroit-arcgis.ts http://localhost:3100 test@example.com:abcdef https://services2.arcgis.com/qvkbeam7Wirps6zC/ArcGIS/rest/services/Affordable_Housing_Website_data_12_20/FeatureServer/0//query

async function main() {
  if (process.argv.length < 5) {
    console.log("usage: yarn ts-node scripts/import-listings-from-detroit-arcgis.ts import_api_url email:password arcgis_url")
    process.exit(1)
  }

  const [importApiUrl, userAndPassword, arcGisUrl] = process.argv.slice(2)
  const [email, password] = userAndPassword.split(":")

  const axios = require('axios').default

  const response = await axios.get(arcGisUrl, {params: {where: "1=1", f: "pjson", outFields: "*"}})

  let numListings = response.data.features.length
  for (let i = 0; i < numListings; i++) {
    const listingAttributes = response.data.features[i].attributes

    let listing = new Listing()
    let property = new Property()
    let address = new Address()

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

    listing.property = property
    listing.name = listingAttributes.Project_Name
    listing.leasingAgentName = listingAttributes.Manager_Contact
    listing.leasingAgentPhone = listingAttributes.Manager_Phone
    listing.preferences = []
    listing.assets = []
    listing.applicationMethods = []
    listing.events = []
    listing.CSVFormattingType = CSVFormattingType.basic
    listing.countyCode = CountyCode.alameda

    // This is a workaround: ListingStatus.closed is a newly added status, and
    // the DB schema doesn't yet include it (a DB migration is needed). There's
    // a transformation in the Listing entity that sets listing_status to
    // "closed" if the application due date has past; to avoid that, we set an
    // application due date 10 days in the future.
    listing.applicationDueDate = new Date(moment().add(10, "days").format())

    try {
      let newListing = await importListing(importApiUrl, email, password, listing)
      console.log("New listing (" + newListing.name + ") created successfully.")
    } catch (e) {
      console.log(e)
      process.exit(1)
    }
  }
  console.log("\nSuccessfully created all " + numListings + " listings!")
}

void main()