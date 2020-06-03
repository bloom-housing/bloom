import "reflect-metadata"
import { Test, TestingModule } from "@nestjs/testing"
import { ListingsController } from "./listings.controller"
import { ListingsService } from "./listings.service"
import { Listing } from "../entity/Listing"
import { Unit } from "../entity/Unit"
import { TypeOrmModule, getRepositoryToken } from "@nestjs/typeorm"
import { Repository } from "typeorm"

describe("ListingsController", () => {
  let listingsController: ListingsController
  let repo: Repository<Listing>

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        ListingsService,
        {
          // how you provide the injection token in a test instance
          provide: getRepositoryToken(Listing),
          // as a class value, Repository needs no generics
          useClass: Repository,
        },
      ],
      controllers: [ListingsController],
    }).compile()

    listingsController = app.get<ListingsController>(ListingsController)
    repo = app.get<Repository<Listing>>(getRepositoryToken(Listing))
  })

  describe("root", () => {
    it('should return "Hello World!"', async () => {
      const testListing: Listing = {
        depositMin: "",
        acceptingApplicationsAtLeasingAgent: false,
        acceptingApplicationsByPoBox: false,
        acceptingOnlineApplications: false,
        acceptsPostmarkedApplications: false,
        accessibility: "",
        amenities: "",
        applicationAddress: undefined,
        applicationDueDate: "",
        applicationFee: "",
        applicationOpenDate: "",
        applicationOrganization: "",
        attachments: [],
        blankPaperApplicationCanBePickedUp: false,
        buildingAddress: undefined,
        buildingSelectionCriteria: "",
        buildingTotalUnits: 0,
        costsNotIncluded: "",
        creditHistory: "",
        criminalBackground: "",
        depositMax: "",
        developer: "",
        disableUnitsAccordion: false,
        id: "",
        imageUrl: "",
        leasingAgentAddress: undefined,
        leasingAgentEmail: "",
        leasingAgentName: "",
        leasingAgentOfficeHours: "",
        leasingAgentPhone: "",
        leasingAgentTitle: "",
        name: "",
        neighborhood: "",
        petPolicy: "",
        postmarkedApplicationsReceivedByDate: "",
        preferences: [],
        programRules: "",
        rentalHistory: "",
        requiredDocuments: "",
        smokingPolicy: "",
        unitAmenities: "",
        units: [],
        unitsAvailable: 0,
        unitsSummarized: undefined,
        urlSlug: "",
        waitlistCurrentSize: 0,
        waitlistMaxSize: 0,
        yearBuilt: 0,
      }
      jest.spyOn(repo, "find").mockResolvedValueOnce([testListing])
      const response = await listingsController.getAll()
      expect(response).toBe([testListing])
    })
  })
})
