import * as fs from "fs"
import CsvReadableStream from "csv-reader"
import dbOptions = require("../ormconfig")
import { Connection, DeepPartial } from "typeorm"
import Listing from "../src/listings/entities/listing.entity
import { UnitsSummary } from "../src/units-summary/entities/units-summary.entity"
import { UnitType } from "../src/unit-types/entities/unit-type.entity"

const args = process.argv.slice(2)

const filePath = args[0]
if (typeof filePath !== "string" && !fs.existsSync(filePath)) {
  throw new Error(`usage: ts-node import-unit-groups.ts csv-file-path`)
}

export class HeaderConstants {
  public static readonly ListingId: string = "ID"
  public static readonly UnitTypeName: string = "Unit Types"
  public static readonly MinOccupancy: string = "Min Occupancy"
  public static readonly MaxOccupancy: string = "Max Occupancy"
  public static readonly TotalCount: string = "Unit Type Quantity (Affordable)"
  public static readonly TotalAvailable: string = "Vacant Units"
  public static readonly OpenWaitlist: string = "Waitlist (Open, Closed)"
}

async function main() {
  const connection = new Connection(dbOptions)
  await connection.connect()

  const listingsRepository = connection.getRepository(Listing)
  const unitTypesRepository = connection.getRepository(UnitType)

  let inputStream = fs.createReadStream(filePath, "utf8")
  inputStream
    .pipe(new CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true, asObject: true }))
    .on("data", async (row) => {
      const listing: DeepPartial<Listing> = await listingsRepository.findOne(row[HeaderConstants.ListingId])
      if (!listing) {
        throw new Error(`Listing with ID: ${row[HeaderConstants.ListingId]} not found.`)
      }

      const unitType = await unitTypesRepository.findOne({where: {name: HeaderConstants.UnitTypeName}})
      if (!unitType) {
        throw new Error(`Unit type  with name: ${row[HeaderConstants.UnitTypeName]} not found.`)
      }

      const newUnitsSummary: DeepPartial<UnitsSummary> = {
        minOccupancy: row[HeaderConstants.MinOccupancy],
        maxOccupancy: row[HeaderConstants.MaxOccupancy],
        totalCount: row[HeaderConstants.TotalCount],
        totalAvailable: row[HeaderConstants.TotalAvailable],
        openWaitlist: row[HeaderConstants.OpenWaitlist],
        unitType: [unitType],
      }
      listing.unitsSummary.push(newUnitsSummary)

      await listingsRepository.save(listing)
    })
}

void main()
