import { Repository } from "typeorm"
import { Test, TestingModule } from "@nestjs/testing"
import { ListingsService } from "./listings.service"
import { getRepositoryToken } from "@nestjs/typeorm"
import { Listing } from "../entity/Listing"
import { factories } from "../../test/factories/index"

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
    const testListing = factories.listing.build()
    jest.spyOn(repo, "find").mockResolvedValueOnce([testListing])
    const results = await service.findAll()
    expect(results.listings).toMatchObject([testListing])
  })
})
