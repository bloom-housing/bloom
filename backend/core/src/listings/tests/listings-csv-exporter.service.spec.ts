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
    const test = service.exportListingsFromObject(mockListings, mockUsers, "America/Los_Angeles")
    expect(test).toMatch("First Come First Serve")
  })
  it("should correctly format units into a csv format", () => {
    const test = service.exportUnitsFromObject(mockListings)
    expect(test).toMatch("1104")
  })
})
