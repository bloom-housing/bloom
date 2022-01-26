import { Test, TestingModule } from "@nestjs/testing"
import { getRepositoryToken } from "@nestjs/typeorm"
import { nanoid } from "nanoid"
import { TranslationsService } from "./translations.service"
import { Translation } from "../entities/translation.entity"
import { Language } from "../../shared/types/language-enum"
import { GeneratedListingTranslation } from "../entities/generated-listing-translation.entity"
import { GoogleTranslateService } from "./google-translate.service"
import { Listing } from "../../listings/entities/listing.entity"
import { BaseEntity } from "typeorm"
import { ApplicationMethodDto } from "../../application-methods/dto/application-method.dto"
import { Jurisdiction } from "../../jurisdictions/entities/jurisdiction.entity"

// Cypress brings in Chai types for the global expect, but we want to use jest
// expect here so we need to re-declare it.
// see: https://github.com/cypress-io/cypress/issues/1319#issuecomment-593500345
declare const expect: jest.Expect

const getMockListing = () => {
  const mockListingTemplate: Omit<Listing, keyof BaseEntity> = {
    additionalApplicationSubmissionNotes: undefined,
    applicationConfig: undefined,
    applicationDropOffAddress: undefined,
    applicationDropOffAddressOfficeHours: undefined,
    applicationDropOffAddressType: undefined,
    applicationDueDate: undefined,
    applicationFee: undefined,
    applicationMailingAddress: undefined,
    applicationMethods: [],
    applicationOpenDate: undefined,
    applicationOrganization: undefined,
    applicationPickUpAddress: undefined,
    applicationPickUpAddressOfficeHours: undefined,
    applicationPickUpAddressType: undefined,
    applicationMailingAddressType: undefined,
    applications: [],
    assets: [],
    buildingSelectionCriteria: undefined,
    buildingSelectionCriteriaFile: undefined,
    commonDigitalApplication: false,
    costsNotIncluded: "costs not included",
    createdAt: undefined,
    creditHistory: undefined,
    criminalBackground: undefined,
    customMapPin: undefined,
    depositHelperText: undefined,
    depositMax: undefined,
    depositMin: undefined,
    digitalApplication: false,
    disableUnitsAccordion: undefined,
    displayWaitlistSize: false,
    events: [],
    id: "",
    image: undefined,
    isWaitlistOpen: undefined,
    jurisdiction: { id: "abcd" } as Jurisdiction,
    leasingAgentAddress: undefined,
    leasingAgentEmail: undefined,
    leasingAgentName: undefined,
    leasingAgentOfficeHours: undefined,
    leasingAgentPhone: undefined,
    leasingAgentTitle: undefined,
    leasingAgents: undefined,
    listingPreferences: [],
    listingPrograms: [],
    name: "",
    paperApplication: false,
    postmarkedApplicationsReceivedByDate: undefined,
    programRules: undefined,
    property: undefined,
    referralOpportunity: false,
    rentalAssistance: undefined,
    rentalHistory: undefined,
    requiredDocuments: undefined,
    reservedCommunityDescription: undefined,
    reservedCommunityMinAge: undefined,
    reservedCommunityType: undefined,
    result: undefined,
    resultLink: undefined,
    reviewOrderType: undefined,
    specialNotes: undefined,
    status: undefined,
    unitsSummarized: undefined,
    unitsSummary: [],
    updatedAt: new Date(),
    waitlistCurrentSize: undefined,
    waitlistMaxSize: undefined,
    waitlistOpenSpots: undefined,
    whatToExpect: undefined,
    get referralApplication(): ApplicationMethodDto | undefined {
      return undefined
    },
    get showWaitlist(): boolean {
      return false
    },
  }
  return JSON.parse(JSON.stringify(mockListingTemplate))
}

describe("TranslationsService", () => {
  let service: TranslationsService
  const translationRepositoryFindOneMock = {
    findOne: jest.fn(),
  }
  const generatedListingTranslationRepositoryMock = {
    findOne: jest.fn(),
    save: jest.fn(),
  }
  const googleTranslateServiceMock = {
    isConfigured: () => true,
    fetch: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TranslationsService,
        {
          provide: getRepositoryToken(Translation),
          useValue: translationRepositoryFindOneMock,
        },
        {
          provide: getRepositoryToken(GeneratedListingTranslation),
          useValue: generatedListingTranslationRepositoryMock,
        },
        {
          provide: GoogleTranslateService,
          useValue: googleTranslateServiceMock,
        },
      ],
    }).compile()
    service = module.get<TranslationsService>(TranslationsService)
  })

  describe("Translations queries", () => {
    it("Should return translations for given county code and language", async () => {
      translationRepositoryFindOneMock.findOne.mockReturnValueOnce({})
      const jurisdictionId = nanoid()
      const result = await service.getTranslationByLanguageAndJurisdictionOrDefaultEn(
        Language.en,
        jurisdictionId
      )
      expect(result).toStrictEqual({})
      expect(translationRepositoryFindOneMock.findOne.mock.calls[0][0].where.language).toEqual(
        Language.en
      )
      expect(
        translationRepositoryFindOneMock.findOne.mock.calls[0][0].where.jurisdiction.id
      ).toEqual(jurisdictionId)
    })

    it("should fetch translations if none are persisted", async () => {
      const mockListing = getMockListing()
      generatedListingTranslationRepositoryMock.findOne.mockResolvedValueOnce(undefined)
      generatedListingTranslationRepositoryMock.save.mockResolvedValueOnce({ translations: [{}] })
      googleTranslateServiceMock.fetch.mockResolvedValueOnce([])

      await service.translateListing(mockListing as Listing, Language.es)
      expect(generatedListingTranslationRepositoryMock.findOne).toHaveBeenCalledTimes(1)
      expect(googleTranslateServiceMock.fetch).toHaveBeenCalledTimes(1)
      expect(generatedListingTranslationRepositoryMock.save).toHaveBeenCalledTimes(1)
    })

    it("should not fetch translations if any are persisted", async () => {
      const mockListing = getMockListing()
      const translations = [["costs not included ES translation"]]
      const persistedTranslation = {
        timestamp: mockListing.updatedAt,
        translations,
      }
      generatedListingTranslationRepositoryMock.findOne.mockResolvedValueOnce(persistedTranslation)

      const result = await service.translateListing(mockListing as Listing, Language.es)
      expect(generatedListingTranslationRepositoryMock.findOne).toHaveBeenCalledTimes(1)
      expect(googleTranslateServiceMock.fetch).toHaveBeenCalledTimes(0)
      expect(generatedListingTranslationRepositoryMock.save).toHaveBeenCalledTimes(0)
      expect(result.applicationPickUpAddressOfficeHours).toBe(translations[0][0])
    })

    it("should fetch translations if timestamp is older than listing updatedAt", async () => {
      const mockListing = getMockListing()
      mockListing.updatedAt = new Date()

      const translations = [["costs not included ES translation"]]
      const newTranslations = [["costs not included ES translation 2"]]
      const persistedTranslation = {
        timestamp: new Date(mockListing.updatedAt.getTime() - 1000),
        translations,
      }
      const newPersistedTranslation = {
        timestamp: mockListing.updatedAt,
        translations: newTranslations,
      }

      generatedListingTranslationRepositoryMock.findOne.mockResolvedValueOnce(persistedTranslation)
      generatedListingTranslationRepositoryMock.save.mockResolvedValueOnce(newPersistedTranslation)
      googleTranslateServiceMock.fetch.mockResolvedValueOnce(newTranslations)

      const result = await service.translateListing(mockListing as Listing, Language.es)
      expect(generatedListingTranslationRepositoryMock.findOne).toHaveBeenCalledTimes(1)
      expect(googleTranslateServiceMock.fetch).toHaveBeenCalledTimes(1)
      expect(generatedListingTranslationRepositoryMock.save).toHaveBeenCalledTimes(1)
      expect(result.applicationPickUpAddressOfficeHours).toBe(newTranslations[0][0])
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
})
