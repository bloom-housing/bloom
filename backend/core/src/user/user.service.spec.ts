import { Test, TestingModule } from "@nestjs/testing"
import { UserService } from "./user.service"
import { getRepositoryToken } from "@nestjs/typeorm"
import { User } from "./entities/user.entity"

// Cypress brings in Chai types for the global expect, but we want to use jest
// expect here so we need to re-declare it.
// see: https://github.com/cypress-io/cypress/issues/1319#issuecomment-593500345
declare const expect: jest.Expect

const mockUserRepo = {}

describe("UserService", () => {
  let service: UserService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepo,
        },
      ],
    }).compile()

    service = module.get(UserService)
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })
})
