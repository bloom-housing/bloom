import { Repository } from "typeorm"
import { Test, TestingModule } from "@nestjs/testing"
import { ListingsService } from "./listings.service"
import { getRepositoryToken } from "@nestjs/typeorm"
import { Listing } from "../entity/Listing"

describe("ListingsService", () => {
  let service: ListingsService
  let repo: Repository<Listing>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListingsService,
        {
          // how you provide the injection token in a test instance
          provide: getRepositoryToken(Listing),
          // as a class value, Repository needs no generics
          useClass: Repository,
        },
      ],
    }).compile()

    service = module.get<ListingsService>(ListingsService)
    // Save the instance of the repository and set the correct generics
    repo = module.get<Repository<Listing>>(getRepositoryToken(Listing))
  })

  it("Find all", async () => {
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
    const results = await service.findAll()
    expect(results).toBe([testListing])
  })
})
