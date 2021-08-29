import { Test, TestingModule } from "@nestjs/testing"
import { getRepositoryToken } from "@nestjs/typeorm"
import { nanoid } from "nanoid"
import { Translation } from "./entities/translation.entity"
import { TranslationsService } from "./translations.service"
import { Language } from "../shared/types/language-enum"

// Cypress brings in Chai types for the global expect, but we want to use jest
// expect here so we need to re-declare it.
// see: https://github.com/cypress-io/cypress/issues/1319#issuecomment-593500345
declare const expect: jest.Expect

describe("TranslationsService", () => {
  let service: TranslationsService
  const translationRepositoryFindOneMock = jest.fn()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TranslationsService,
        {
          provide: getRepositoryToken(Translation),
          useValue: { findOne: translationRepositoryFindOneMock },
        },
      ],
    }).compile()

    service = module.get<TranslationsService>(TranslationsService)
    translationRepositoryFindOneMock.mockReturnValue({})
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  describe("Translations queries", () => {
    it("Should return translations for given county code and language", async () => {
      const jurisdictionId = nanoid()
      const result = await service.getTranslationByLanguageAndJurisdictionOrDefaultEn(
        Language.en,
        jurisdictionId
      )
      expect(result).toStrictEqual({})
      expect(translationRepositoryFindOneMock.mock.calls[0][0].where.language).toEqual(Language.en)
      expect(translationRepositoryFindOneMock.mock.calls[0][0].where.jurisdictionId).toEqual(
        jurisdictionId
      )
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
})
