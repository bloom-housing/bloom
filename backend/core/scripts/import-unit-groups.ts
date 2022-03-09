import * as fs from "fs"
import CsvReadableStream from "csv-reader"
import { Connection, DeepPartial } from "typeorm"
import { Listing } from "../src/listings/entities/listing.entity"
import { UnitGroup } from "../src/units-summary/entities/unit-group.entity"
import { UnitGroupAmiLevel } from "../src/units-summary/entities/unit-group-ami-level.entity"
import { UnitType } from "../src/unit-types/entities/unit-type.entity"
import { AmiChart } from "../src/ami-charts/entities/ami-chart.entity"
import { HUD2021 } from "../src/seeder/seeds/ami-charts/HUD2021"
import { MSHDA2021 } from "../src/seeder/seeds/ami-charts/MSHDA2021"
import { MonthlyRentDeterminationType } from "../src/units-summary/types/monthly-rent-determination.enum"
import dbOptions = require("../ormconfig")

// TODO how to solve 4+BR

type AmiChartNameType = "MSHDA" | "HUD"
type TAmiChartLevel = {
  amiChartName: AmiChartNameType
  amiPercentage: number
}

const args = process.argv.slice(2)

const filePath = args[0]
if (typeof filePath !== "string" && !fs.existsSync(filePath)) {
  throw new Error(`usage: ts-node import-unit-groups.ts csv-file-path`)
}

export class HeaderConstants {
  public static readonly TemporaryListingId: string = "ID"
  public static readonly UnitTypeName: string = "Unit Types"
  public static readonly MinOccupancy: string = "Min Occupancy"
  public static readonly MaxOccupancy: string = "Max Occupancy"
  public static readonly TotalCount: string = "Unit Type Quantity (Affordable)"
  public static readonly TotalAvailable: string = "Vacant Units"
  public static readonly WaitlistClosed: string = "Waitlist Closed"
  public static readonly WaitlistOpen: string = "Waitlist Open"
  public static readonly AMIChart: string = "AMI Chart"
  public static readonly AmiChartPercentage: string = "Percent AMIs"
}

function generateAmiChartLevels(
  amiChartsColumns: string,
  amiPercentagesColumn: string | number
): Array<TAmiChartLevel> {
  const amiChartLevels = []

  for (const amiChartName of amiChartsColumns.split("/")) {
    // TODO remove && amiPercentagesColumn when empty AMI percentage column problem is solved
    if (typeof amiPercentagesColumn === "string" && amiPercentagesColumn) {
      for (const amiPercentage of amiPercentagesColumn.split(",").map((s) => s.trim())) {
        amiChartLevels.push({
          amiChartName,
          amiPercentage: Number.parseInt(amiPercentage),
        })
      }
    } else if (typeof amiPercentagesColumn === "number") {
      amiChartLevels.push({
        amiChartName,
        amiPercentage: amiPercentagesColumn,
      })
    }
  }

  return amiChartLevels
}

function findAmiChartByName(
  amiCharts: Array<AmiChart>,
  spreadSheetAmiChartName: AmiChartNameType
): AmiChart {
  const SpreadSheetAmiChartNameToDbChartNameMapping: Record<AmiChartNameType, string> = {
    MSHDA: MSHDA2021.name,
    HUD: HUD2021.name,
  }
  return amiCharts.find(
    (amiChart) =>
      amiChart.name === SpreadSheetAmiChartNameToDbChartNameMapping[spreadSheetAmiChartName]
  )
}

function getFlatRentValueForAmiChart(amiChart: AmiChart, amiPercentage: number) {
  return amiChart.items.find((item) => item.percentOfAmi === amiPercentage).percentOfAmi
}

function generateUnitsSummaryAmiLevels(
  amiCharts: Array<AmiChart>,
  inputAmiChartLevels: Array<TAmiChartLevel>
) {
  const amiChartLevels: Array<DeepPartial<UnitGroupAmiLevel>> = []

  for (const inputAmiChartLevel of inputAmiChartLevels) {
    const amiChart = findAmiChartByName(amiCharts, inputAmiChartLevel.amiChartName)
    const monthlyRentDeterminationType =
      inputAmiChartLevel.amiChartName === "MSHDA"
        ? MonthlyRentDeterminationType.flatRent
        : MonthlyRentDeterminationType.percentageOfIncome

    amiChartLevels.push({
      amiChart: amiChart,
      amiPercentage: inputAmiChartLevel.amiPercentage,
      monthlyRentDeterminationType,
      flatRentValue:
        monthlyRentDeterminationType === MonthlyRentDeterminationType.flatRent
          ? getFlatRentValueForAmiChart(amiChart, inputAmiChartLevel.amiPercentage)
          : null,
    })
  }

  return amiChartLevels
}

function getOpenWaitlistValue(row): boolean {
  const waitlistClosedColumn = row[HeaderConstants.WaitlistClosed]
  if (waitlistClosedColumn === "Closed") {
    return false
  }

  const waitlistOpenColumn = row[HeaderConstants.WaitlistOpen]
  if (waitlistOpenColumn === "Open") {
    return true
  }

  return true
}

async function main() {
  const connection = new Connection(dbOptions)
  await connection.connect()

  const listingsRepository = connection.getRepository(Listing)
  const unitTypesRepository = connection.getRepository(UnitType)
  const amiChartsRepository = connection.getRepository(AmiChart)

  const amiCharts = await amiChartsRepository.find()

  const inputStream = fs.createReadStream(filePath, "utf8")
  inputStream
    .pipe(
      new CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true, asObject: true })
    )
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    .on("data", async (row) => {
      try {
        const listing: DeepPartial<Listing> = await listingsRepository.findOne({
          where: {
            temporaryListingId: row[HeaderConstants.TemporaryListingId],
          },
        })
        if (!listing) {
          throw new Error(`Listing with ID: ${row[HeaderConstants.TemporaryListingId]} not found.`)
        }

        const unitTypes = []
        if (row[HeaderConstants.UnitTypeName]) {
          const spreadsheetUnitTypeNameToDbUnitTypeName = {
            "1BR": "oneBdrm",
            "2BR": "twoBdrm",
            "3BR": "threeBdrm",
            "4+BR": "fourBdrm",
            "4BR": "fourBdrm",
            Studio: "studio",
          }

          const unitType = await unitTypesRepository.findOneOrFail({
            where: {
              name: spreadsheetUnitTypeNameToDbUnitTypeName[row[HeaderConstants.UnitTypeName]],
            },
          })
          unitTypes.push(unitType)
        }

        const inputAmiChartLevels = generateAmiChartLevels(
          row[HeaderConstants.AMIChart],
          row[HeaderConstants.AmiChartPercentage]
        )

        const newUnitsSummary: DeepPartial<UnitGroup> = {
          minOccupancy: row[HeaderConstants.MinOccupancy]
            ? row[HeaderConstants.MinOccupancy]
            : null,
          maxOccupancy: row[HeaderConstants.MaxOccupancy]
            ? row[HeaderConstants.MinOccupancy]
            : null,
          totalCount: row[HeaderConstants.TotalCount] ? row[HeaderConstants.TotalCount] : null,
          totalAvailable: row[HeaderConstants.TotalAvailable]
            ? row[HeaderConstants.TotalAvailable]
            : null,
          openWaitlist: getOpenWaitlistValue(row),
          unitType: unitTypes,
          amiLevels: generateUnitsSummaryAmiLevels(amiCharts, inputAmiChartLevels),
        }
        listing.unitGroups.push(newUnitsSummary)

        await listingsRepository.save(listing)
      } catch (e) {
        console.error(row)
        console.error(e)
      }
    })
}

void main()
