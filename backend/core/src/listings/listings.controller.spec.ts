import { Test, TestingModule } from "@nestjs/testing"
import { ListingsController } from "./listings.controller"
import { PassportModule } from "@nestjs/passport"
import { ListingsService } from "./listings.service"
import { AuthzService } from "../auth/services/authz.service"
import { CacheModule } from "@nestjs/common"
import { ActivityLogService } from "../activity-log/services/activity-log.service"
import { ListingsCsvExporterService } from "./listings-csv-exporter.service"

// Cypress brings in Chai types for the global expect, but we want to use jest
// expect here so we need to re-declare it.
// see: https://github.com/cypress-io/cypress/issues/1319#issuecomment-593500345
declare const expect: jest.Expect

describe("Listings Controller", () => {
  let controller: ListingsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule,
        CacheModule.register({
          ttl: 60,
          max: 2,
        }),
      ],
      providers: [
        { provide: AuthzService, useValue: {} },
        { provide: ListingsService, useValue: {} },
        { provide: ActivityLogService, useValue: {} },
        { provide: ListingsCsvExporterService, useValue: {} },
      ],
      controllers: [ListingsController],
    }).compile()

    controller = module.get<ListingsController>(ListingsController)
  })

  it("should be defined", () => {
    expect(controller).toBeDefined()
  })
})
