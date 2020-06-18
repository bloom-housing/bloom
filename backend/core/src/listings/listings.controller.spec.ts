import "reflect-metadata"
import { Test, TestingModule } from "@nestjs/testing"
import { ListingsController } from "./listings.controller"
import { ListingsService } from "./listings.service"
import { Listing } from "../entity/Listing"
import { Unit } from "../entity/Unit"
import { TypeOrmModule, getRepositoryToken } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { factories } from "../../test/factories/index"

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
    it("should return listings", async () => {
      const testListing = factories.listing.build()
      jest.spyOn(repo, "find").mockResolvedValueOnce([testListing])
      const response = await listingsController.getAll()
      expect(response.status).toBe("ok")
      expect(response.listings).toMatchObject([testListing])
    })
  })
})
