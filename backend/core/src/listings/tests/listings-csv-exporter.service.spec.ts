import { ListingsCsvExporterService } from "../listings-csv-exporter.service"
import { Test, TestingModule } from "@nestjs/testing"
import { listing, user } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { CsvBuilder } from "../../../src/applications/services/csv-builder.service"

const mockListings = [listing]
const mockUsers = [user]
// Cypress brings in Chai types for the global expect, but we want to use jest
// expect here so we need to re-declare it.
// see: https://github.com/cypress-io/cypress/issues/1319#issuecomment-593500345
declare const expect: jest.Expect
let service: ListingsCsvExporterService

describe("ListingsCSVExporterService", () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListingsCsvExporterService, CsvBuilder],
    }).compile()

    service = await module.resolve(ListingsCsvExporterService)
  })
  afterEach(() => {
    jest.clearAllMocks()
  })
  it("should be defined", () => {
    expect(service).toBeDefined()
  })
  it("should correctly format listings into a csv format", () => {
    const listingsCSV = service.exportListingsFromObject(
      mockListings,
      mockUsers,
      "America/Los_Angeles"
    )
    expect(listingsCSV).toMatch("First Come First Serve")
    expect(listingsCSV).toMatch("2012")
    expect(listingsCSV).toMatch(
      "No pets allowed. Accommodation animals may be granted to persons with disabilities via a reasonable accommodation request."
    )
    expect(listingsCSV).toMatch("Available Units")
    expect(listingsCSV).toMatch("Marisela Baca")
  })
  it("should correctly format units into a csv format", () => {
    const unitsCSV = service.exportUnitsFromObject(mockListings)
    expect(unitsCSV).toMatch("1104.0")
    expect(unitsCSV).toMatch("285")
    expect(unitsCSV).toMatch("Fixed amount")
    expect(unitsCSV).toMatch("Archer Studios")
    expect(unitsCSV).toMatch("Studio")
  })
})
