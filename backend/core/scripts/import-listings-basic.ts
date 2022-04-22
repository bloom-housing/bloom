import * as fs from "fs"
import CsvReadableStream from "csv-reader"
import { Connection, DeepPartial } from "typeorm"
import { Listing } from "../src/listings/entities/listing.entity"
import { Jurisdiction } from "../src/jurisdictions/entities/jurisdiction.entity"
import dbOptions = require("../ormconfig")
import { Program } from "../src/program/entities/program.entity"
import { AddressCreateDto } from "../src/shared/dto/address.dto"

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const getStream = require("get-stream")

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const MapboxClient = require("mapbox")

if (!process.env["MAPBOX_TOKEN"]) {
  throw new Error("environment variable MAPBOX_TOKEN is undefined")
}
const args = process.argv.slice(2)

const client = new MapboxClient(process.env["MAPBOX_TOKEN"])

const filePath = args[0]
if (typeof filePath !== "string" && !fs.existsSync(filePath)) {
  throw new Error(`usage: ts-node import-unit-groups.ts csv-file-path`)
}

export class HeaderConstants {
  public static readonly TemporaryId: string = "ID"
  public static readonly Name: string = "Building Name"
  public static readonly Developer: string = "Developer"
  public static readonly BuildingAddressStreet: string = "Building Street Address"
  public static readonly BuildingAddressCity: string = "City"
  public static readonly BuildingAddressState: string = "State"
  public static readonly BuildingAddressZipCode: string = "Zip Code"
  public static readonly Neighborhood: string = "Neighborhood 2"
  public static readonly YearBuilt: string = "Year Built"
  public static readonly CommunityTypePrograms: string = "Community Type"
  public static readonly LeasingAgentName: string = "Leasing Agent Name (Property Mgmt Company)"
  public static readonly LeasingAgentEmail: string = "Leasing Agent Email"
  public static readonly LeasingAgentPhone: string = "Leasing Agent Phone"
  public static readonly ManagementWebsite: string = "Management Website"
  public static readonly LeasingAgentAddress: string = "Leasing Agent Address"
  public static readonly ApplicationFee: string = "Application Fee"
  public static readonly DepositMin: string = "Deposit Min"
  public static readonly DepositMax: string = "Deposit Max"
  public static readonly DepositHelperText: string = "Deposit HelperText"
  public static readonly CostsNotIncluded: string = "Costs not included"
  public static readonly PropertyAmenities: string = "Property Amenities"
  public static readonly HeatingInUnit: string = "Heating in Unit"
  public static readonly AcInUnit: string = "AC in Unit"
  public static readonly LaundryInBuilding: string = "Laundry in Building"
  public static readonly ParkingOnSiteElevator: string = "Parking On Site	Elevator"
  public static readonly ServiceAnimalsAllowed: string = "Service Animals Allowed"
  public static readonly RollInShower: string = "Roll in Shower"
  public static readonly WheelchairRamp: string = "Wheelchair Ramp"
  public static readonly AccessibleParking: string = "Accessible Parking"
  public static readonly InUnitWasherDryer: string = "In Unit Washer Dryer"
  public static readonly BarrierFreeEntrance: string = "Barrier Free Entrance"
  public static readonly GrabBars: string = "Grab Bars"
  public static readonly Hearing: string = "Hearing"
  public static readonly Visual: string = "Visual"
  public static readonly Mobility: string = "Mobility"
  public static readonly AdditionalAccessibility: string = "Additional Accessibility"
  public static readonly RentalAssistance: string = "RentalAssistance"
  public static readonly SmokingPolicy: string = "Smoking Policy"
  public static readonly PetPolicy: string = "Pet Policy"
  public static readonly RequiredDocuments: string = "Required Documents"
  public static readonly ImportantProgramRules: string = "Important Program Rules"
  public static readonly SpecialNotes: string = "Special Notes"
}

async function fetchDetroitJurisdiction(connection: Connection): Promise<Jurisdiction> {
  const jurisdictionsRepository = connection.getRepository(Jurisdiction)
  return await jurisdictionsRepository.findOneOrFail({
    where: {
      name: "Detroit",
    },
  })
}

async function fetchProgramsOrFail(
  connection: Connection,
  programsString: string
): Promise<Program[]> {
  if (!programsString) {
    return []
  }

  const programsRepository = connection.getRepository<Program>(Program)
  const programTitles = programsString.split(",").map((p) => p.trim())

  return Promise.all(
    programTitles.map((programTitle) => {
      return programsRepository.findOneOrFail({ where: { title: programTitle } })
    })
  )
}

function destructureYearBuilt(yearBuilt: string): number {
  if (!yearBuilt) {
    return null
  }

  if (typeof yearBuilt === "number") {
    return yearBuilt
  }

  if (yearBuilt.includes("/")) {
    const [year1, year2] = yearBuilt.split("/")
    return Number.parseInt(year2)
  }

  return Number.parseInt(yearBuilt)
}

async function getLatitudeAndLongitude(
  address: string
): Promise<{ latitude: number; longitude: number }> {
  const res = await client.geocodeForward(address)
  let latitude
  let longitude
  if (res.entity?.features?.length) {
    latitude = res.entity.features[0].center[0]
    longitude = res.entity.features[0].center[1]
  }
  return { latitude, longitude }
}

async function destructureAddressString(addressString: string): Promise<AddressCreateDto> {
  if (!addressString) {
    return null
  }

  const tokens = addressString.split(",").map((addressString) => addressString.trim())

  const { latitude, longitude } = await getLatitudeAndLongitude(addressString)

  if (tokens.length === 1) {
    return {
      street: tokens[0],
      city: undefined,
      state: undefined,
      zipCode: undefined,
      latitude,
      longitude,
    }
  }

  const [state, zipCode] = tokens[2].split(" ")

  return {
    street: tokens[0],
    city: tokens[1],
    state,
    zipCode,
    latitude,
    longitude,
  }
}

async function main() {
  const connection = new Connection(dbOptions)
  await connection.connect()

  const detroitJurisdiction = await fetchDetroitJurisdiction(connection)

  const listingsRepository = connection.getRepository(Listing)

  let rowsCount = 0
  let failedRowsCounts = 0
  const failedRowsIDs = []

  const inputRows = await getStream.array(
    fs.createReadStream(filePath, "utf8").pipe(
      new CsvReadableStream({
        parseNumbers: true,
        parseBooleans: true,
        trim: true,
        asObject: true,
      })
    )
  )

  for (const row of inputRows) {
    rowsCount += 1
    try {
      console.info(`Importing row ${row[HeaderConstants.TemporaryId]}`)
      const programsString = row[HeaderConstants.CommunityTypePrograms]
      const communityTypePrograms = await fetchProgramsOrFail(connection, programsString)
      const newListing: DeepPartial<Listing> = {
        temporaryListingId: row[HeaderConstants.TemporaryId],
        assets: [],
        name: row[HeaderConstants.Name],
        displayWaitlistSize: false,
        property: {
          developer: row[HeaderConstants.Developer],
          accessibility: row[HeaderConstants.AdditionalAccessibility],
          smokingPolicy: row[HeaderConstants.SmokingPolicy],
          petPolicy: row[HeaderConstants.PetPolicy],
          amenities: row[HeaderConstants.PropertyAmenities],
          buildingAddress: {
            street: row[HeaderConstants.BuildingAddressStreet],
            city: row[HeaderConstants.BuildingAddressCity],
            state: row[HeaderConstants.BuildingAddressState],
            zipCode: row[HeaderConstants.BuildingAddressZipCode],
            ...(await getLatitudeAndLongitude(
              [
                row[HeaderConstants.BuildingAddressStreet],
                row[HeaderConstants.BuildingAddressCity],
                row[HeaderConstants.BuildingAddressState],
                row[HeaderConstants.BuildingAddressZipCode],
              ].join(" ")
            )),
          },
          neighborhood: row[HeaderConstants.Neighborhood],
          yearBuilt: destructureYearBuilt(row[HeaderConstants.YearBuilt]),
        },
        jurisdiction: detroitJurisdiction,
        listingPrograms: communityTypePrograms.map((program) => {
          return {
            program: program,
            ordinal: null,
          }
        }),
        leasingAgentName: row[HeaderConstants.LeasingAgentName],
        leasingAgentEmail: row[HeaderConstants.LeasingAgentEmail],
        leasingAgentPhone: row[HeaderConstants.LeasingAgentPhone],
        managementWebsite: row[HeaderConstants.ManagementWebsite],
        leasingAgentAddress: await destructureAddressString(
          row[HeaderConstants.LeasingAgentAddress]
        ),
        applicationFee: row[HeaderConstants.ApplicationFee],
        depositMin: row[HeaderConstants.DepositMin],
        depositMax: row[HeaderConstants.DepositMax],
        depositHelperText: row[HeaderConstants.DepositHelperText],
        costsNotIncluded: row[HeaderConstants.CostsNotIncluded],
        features: {
          heatingInUnit: row[HeaderConstants.HeatingInUnit] === "Yes",
          acInUnit: row[HeaderConstants.AcInUnit] === "Yes",
          laundryInBuilding: row[HeaderConstants.LaundryInBuilding] === "Yes",
          parkingOnSite: row[HeaderConstants.ParkingOnSiteElevator] === "Yes",
          serviceAnimalsAllowed: row[HeaderConstants.ServiceAnimalsAllowed] === "Yes",
          rollInShower: row[HeaderConstants.RollInShower] === "Yes",
          wheelchairRamp: row[HeaderConstants.WheelchairRamp] === "Yes",
          accessibleParking: row[HeaderConstants.AccessibleParking] === "Yes",
          inUnitWasherDryer: row[HeaderConstants.InUnitWasherDryer] === "Yes",
          barrierFreeEntrance: row[HeaderConstants.BarrierFreeEntrance] === "Yes",
          grabBars: row[HeaderConstants.GrabBars] === "Yes",
        },
        requiredDocuments: row[HeaderConstants.RequiredDocuments],
        programRules: row[HeaderConstants.ImportantProgramRules],
        specialNotes: row[HeaderConstants.SpecialNotes],
        rentalAssistance: row[HeaderConstants.RentalAssistance],
      }
      await listingsRepository.save(newListing)
    } catch (e) {
      console.error(`skipping row: ${row[HeaderConstants.TemporaryId]}`)
      console.error(e)
      failedRowsCounts += 1
      failedRowsIDs.push(row[HeaderConstants.TemporaryId])
    }
  }
  console.log(`${failedRowsCounts}/${rowsCount} rows failed`)
  console.log("IDs:")
  console.log(failedRowsIDs)
}

void main()
