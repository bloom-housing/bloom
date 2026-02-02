import { cleanup } from "@testing-library/react"
import {
  FeatureFlagEnum,
  Listing,
  MultiselectQuestionsApplicationSectionEnum,
  MultiselectQuestionsStatusEnum,
  UnitsSummarized,
  ApplicationMethod,
  ApplicationMethodsTypeEnum,
  ListingMultiselectQuestion,
  Asset,
  LanguagesEnum,
  PaperApplication,
  ListingFeatures,
  ListingUtilities,
  Address,
  ApplicationAddressTypeEnum,
  EnumListingListingType,
  Jurisdiction,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { jurisdiction, listing } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import {
  getCurrencyFromArgumentString,
  getEligibilitySections,
  getStackedHmiData,
  getFilteredMultiselectQuestions,
  getMultiselectQuestionData,
  hasMethod,
  getMethod,
  getPaperApplications,
  getOnlineApplicationURL,
  getHasNonReferralMethods,
  getAccessibilityFeatures,
  getUtilitiesIncluded,
  getFeatures,
  getAmiValues,
  getAddress,
  getReservedTitle,
  getDateString,
  getBuildingSelectionCriteria,
  getAdditionalInformation,
  getMarketingFlyers,
} from "../../../src/components/listing/ListingViewSeedsHelpers"

afterEach(cleanup)

describe("ListingViewSeedsHelpers", () => {
  describe("getFilteredMultiselectQuestions", () => {
    it("should filter multiselect questions by application section", () => {
      const mockQuestions: ListingMultiselectQuestion[] = [
        {
          multiselectQuestions: {
            id: "1",
            applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
            hideFromListing: false,
          },
        } as ListingMultiselectQuestion,
        {
          multiselectQuestions: {
            id: "2",
            applicationSection: MultiselectQuestionsApplicationSectionEnum.preferences,
            hideFromListing: false,
          },
        } as ListingMultiselectQuestion,
      ]

      const result = getFilteredMultiselectQuestions(
        mockQuestions,
        MultiselectQuestionsApplicationSectionEnum.programs
      )

      expect(result).toHaveLength(1)
      expect(result[0].multiselectQuestions.id).toBe("1")
    })

    it("should exclude hidden questions", () => {
      const mockQuestions: ListingMultiselectQuestion[] = [
        {
          multiselectQuestions: {
            id: "1",
            applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
            hideFromListing: true,
          },
        } as ListingMultiselectQuestion,
        {
          multiselectQuestions: {
            id: "2",
            applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
            hideFromListing: false,
          },
        } as ListingMultiselectQuestion,
      ]

      const result = getFilteredMultiselectQuestions(
        mockQuestions,
        MultiselectQuestionsApplicationSectionEnum.programs
      )

      expect(result).toHaveLength(1)
      expect(result[0].multiselectQuestions.id).toBe("2")
    })
  })

  describe("getMultiselectQuestionData", () => {
    it("should map multiselect questions to data format with ordinals", () => {
      const mockQuestions: ListingMultiselectQuestion[] = [
        {
          multiselectQuestions: {
            id: "1",
            text: "Question 1",
            description: "Description 1",
            links: [{ title: "Link 1", url: "http://example.com" }],
            applicationSection: MultiselectQuestionsApplicationSectionEnum.preferences,
          },
        } as ListingMultiselectQuestion,
        {
          multiselectQuestions: {
            id: "2",
            text: "Question 2",
            description: "Description 2",
            links: [],
            applicationSection: MultiselectQuestionsApplicationSectionEnum.preferences,
          },
        } as ListingMultiselectQuestion,
      ]

      const result = getMultiselectQuestionData(mockQuestions)

      expect(result).toHaveLength(2)
      expect(result[0].ordinal).toBe(1)
      expect(result[0].title).toBe("Question 1")
      expect(result[0].description).toBe("Description 1")
      expect(result[1].ordinal).toBe(2)
      expect(result[1].title).toBe("Question 2")
    })
  })

  describe("hasMethod", () => {
    it("should return true if application method type exists", () => {
      const methods: ApplicationMethod[] = [
        { type: ApplicationMethodsTypeEnum.Internal, externalReference: "" } as ApplicationMethod,
        {
          type: ApplicationMethodsTypeEnum.PaperPickup,
          externalReference: "",
        } as ApplicationMethod,
      ]

      const result = hasMethod(methods, ApplicationMethodsTypeEnum.Internal)
      expect(result).toBe(true)
    })

    it("should return false for methods array that does not include", () => {
      const result = hasMethod(
        [
          { type: ApplicationMethodsTypeEnum.Internal, externalReference: "" } as ApplicationMethod,
          {
            type: ApplicationMethodsTypeEnum.PaperPickup,
            externalReference: "",
          } as ApplicationMethod,
        ],
        ApplicationMethodsTypeEnum.Referral
      )
      expect(result).toBe(false)
    })

    it("should return false for empty methods array", () => {
      const result = hasMethod([], ApplicationMethodsTypeEnum.Internal)
      expect(result).toBe(false)
    })
  })

  describe("getMethod", () => {
    it("should return the application method of specified type", () => {
      const methods: ApplicationMethod[] = [
        {
          type: ApplicationMethodsTypeEnum.Internal,
          externalReference: "http://example.com",
        } as ApplicationMethod,
        {
          type: ApplicationMethodsTypeEnum.PaperPickup,
          externalReference: "",
        } as ApplicationMethod,
      ]

      const result = getMethod(methods, ApplicationMethodsTypeEnum.Internal)
      expect(result?.type).toBe(ApplicationMethodsTypeEnum.Internal)
      expect(result?.externalReference).toBe("http://example.com")
    })
  })

  describe("getPaperApplications", () => {
    it("should return paper applications from FileDownload method", () => {
      const methods: ApplicationMethod[] = [
        {
          type: ApplicationMethodsTypeEnum.FileDownload,
          externalReference: "",
          paperApplications: [
            {
              id: "1",
              language: LanguagesEnum.en,
              assets: { fileId: "123" } as Asset,
            } as PaperApplication,
            {
              id: "2",
              language: LanguagesEnum.es,
              assets: { fileId: "456" } as Asset,
            } as PaperApplication,
          ],
        } as ApplicationMethod,
      ]

      const result = getPaperApplications(methods)
      expect(result).toHaveLength(2)
    })

    it("should put English language first in paper applications", () => {
      const methods: ApplicationMethod[] = [
        {
          type: ApplicationMethodsTypeEnum.FileDownload,
          externalReference: "",
          paperApplications: [
            {
              id: "1",
              language: LanguagesEnum.es,
              assets: { fileId: "456" } as Asset,
            } as PaperApplication,
            {
              id: "2",
              language: LanguagesEnum.en,
              assets: { fileId: "123" } as Asset,
            } as PaperApplication,
          ],
        } as ApplicationMethod,
      ]

      const result = getPaperApplications(methods)
      expect(result?.[0].languageString).toContain("English")
    })
  })

  describe("getOnlineApplicationURL", () => {
    it("should return online application URL from ExternalLink method", () => {
      const methods: ApplicationMethod[] = [
        {
          type: ApplicationMethodsTypeEnum.ExternalLink,
          externalReference: "http://example.com/apply",
        } as ApplicationMethod,
      ]

      const result = getOnlineApplicationURL(methods, "123", false)
      expect(result.url).toBe("http://example.com/apply")
    })

    it("should return online application URL from Internal method", () => {
      const methods: ApplicationMethod[] = [
        {
          type: ApplicationMethodsTypeEnum.Internal,
          externalReference: "",
        } as ApplicationMethod,
      ]

      const result = getOnlineApplicationURL(methods, "123", false)
      expect(result.url).toBe("/applications/start/choose-language?listingId=123")
      expect(result.isCommonApp).toBe(true)
    })

    it("should include preview parameter when preview is true", () => {
      const methods: ApplicationMethod[] = [
        {
          type: ApplicationMethodsTypeEnum.Internal,
          externalReference: "",
        } as ApplicationMethod,
      ]

      const result = getOnlineApplicationURL(methods, "123", true)
      expect(result.url).toBe("/applications/start/choose-language?listingId=123&preview=true")
      expect(result.isCommonApp).toBe(true)
    })

    it("should return null if no ExternalLink method exists", () => {
      const methods: ApplicationMethod[] = [
        {
          type: ApplicationMethodsTypeEnum.FileDownload,
          externalReference: "",
        } as ApplicationMethod,
      ]

      const result = getOnlineApplicationURL(methods, "123", false)
      expect(result.url).toBeUndefined()
    })
  })

  describe("getHasNonReferralMethods", () => {
    it("should return true if listing has non-referral application methods", () => {
      const mockListing: Listing = {
        ...listing,
        applicationMethods: [
          {
            type: ApplicationMethodsTypeEnum.ExternalLink,
            externalReference: "http://example.com",
          } as ApplicationMethod,
        ],
      }

      const result = getHasNonReferralMethods(mockListing)
      expect(result).toBe(1)
    })

    it("should return false if listing has no application methods", () => {
      const mockListing: Listing = {
        ...listing,
        applicationMethods: [],
      }

      const result = getHasNonReferralMethods(mockListing)
      expect(result).toBe(0)
    })
  })

  describe("getAccessibilityFeatures", () => {
    it("should return null if no features are enabled", () => {
      const mockListing: Listing = {
        ...listing,
        listingFeatures: {
          accessibleParking: false,
          elevator: false,
        } as ListingFeatures,
      }

      const config = { categories: [] }

      const result = getAccessibilityFeatures(mockListing, config)
      expect(result).toBeNull()
    })

    it("should return features organized by category when config has categories", () => {
      const mockListing: Listing = {
        ...listing,
        listingFeatures: {
          accessibleParking: true,
          elevator: true,
          barrierFreeBathroom: true,
        } as ListingFeatures,
      }

      const config = {
        categories: [
          {
            id: "mobility",
            fields: [{ id: "accessibleParking" }, { id: "elevator" }],
          },
          {
            id: "bathroom",
            fields: [{ id: "barrierFreeBathroom" }],
          },
        ],
      }

      const result = getAccessibilityFeatures(mockListing, config)
      expect(result).not.toBeNull()
      expect(Array.isArray(result)).toBe(true)
      expect(result).toHaveLength(2)
    })

    it("should return flat list of features when no categories in config", () => {
      const mockListing: Listing = {
        ...listing,
        listingFeatures: {
          accessibleParking: true,
          elevator: true,
        } as ListingFeatures,
      }

      const config = { categories: [] }

      const result = getAccessibilityFeatures(mockListing, config)
      expect(result).not.toBeNull()
      expect(Array.isArray(result)).toBe(false)
    })
  })

  describe("getUtilitiesIncluded", () => {
    it("should return array of enabled utilities", () => {
      const mockListing: Listing = {
        ...listing,
        listingUtilities: {
          water: true,
          gas: false,
          trash: true,
        } as ListingUtilities,
      }

      const result = getUtilitiesIncluded(mockListing)
      expect(result).toHaveLength(2)
    })

    it("should return empty array if no utilities are enabled", () => {
      const mockListing: Listing = {
        ...listing,
        listingUtilities: {
          water: false,
          gas: false,
        } as ListingUtilities,
      }

      const result = getUtilitiesIncluded(mockListing)
      expect(result).toHaveLength(0)
    })

    it("should return empty array if listing utilities is undefined", () => {
      const mockListing: Listing = {
        ...listing,
        listingUtilities: undefined,
      }

      const result = getUtilitiesIncluded(mockListing)
      expect(result).toHaveLength(0)
    })
  })

  describe("getFeatures", () => {
    it("should include year built when available", () => {
      const mockListing: Listing = {
        ...listing,
        yearBuilt: 2020,
      }

      const result = getFeatures(mockListing, jurisdiction)
      const builtFeature = result.find((f) => f.heading === "Built")
      expect(builtFeature).toBeDefined()
      expect(builtFeature?.subheading).toBe(2020)
    })

    it("should include amenities when available", () => {
      const mockListing: Listing = {
        ...listing,
        amenities: "Pool, Gym",
        unitAmenities: "Balcony, Dishwasher",
      }

      const result = getFeatures(mockListing, jurisdiction)
      const amenitiesFeature = result.find((f) => f.heading === "Property amenities")
      const unitAmenities = result.find((f) => f.heading === "Unit amenities")
      expect(amenitiesFeature).toBeDefined()
      expect(amenitiesFeature?.subheading).toBe("Pool, Gym")
      expect(unitAmenities).toBeDefined()
      expect(unitAmenities?.subheading).toBe("Balcony, Dishwasher")
    })

    it("should not include pet policy if no data", () => {
      const mockListing: Listing = {
        ...listing,
        allowsDogs: false,
        allowsCats: false,
        petPolicy: undefined,
      }

      const result = getFeatures(mockListing, jurisdiction)
      const petPolicyFeature = result.find((f) => f.heading === "Pet policy")
      expect(petPolicyFeature).toBeUndefined()
    })
    it("should show the correct bullets when enablePetPolicyCheckbox is true", () => {
      const mockJurisdiction = {
        ...jurisdiction,
        featureFlags: [
          {
            name: FeatureFlagEnum.enablePetPolicyCheckbox,
            active: true,
          },
        ],
      } as Jurisdiction

      const mockListing: Listing = {
        ...listing,
        allowsDogs: true,
        allowsCats: true,
      }

      const result = getFeatures(mockListing, mockJurisdiction)
      const petPolicyFeature = result.find((f) => f.heading === "Pets policy")
      expect(petPolicyFeature).toBeDefined()
      expect(petPolicyFeature?.content).toBeDefined()

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const elementList = petPolicyFeature.content as any
      const petList = elementList.props.children
      expect(petList.length).toBe(2)
      expect(petList[0].props.children).toBe("Allows dogs")
      expect(petList[1].props.children).toBe("Allows cats")
    })
    it("should include parking fee when available", () => {
      const mockListing: Listing = {
        ...listing,
        parkingFee: "150",
      }

      const result = getFeatures(mockListing, jurisdiction)
      const parkingFeeFeature = result.find((f) => f.heading === "Parking fee")
      expect(parkingFeeFeature).toBeDefined()
      expect(parkingFeeFeature?.subheading).toBe("$150")
    })
    it("should not show accessibility features even if there is content when enableAccessibilityFeatures is false", () => {
      const mockJurisdiction = {
        ...jurisdiction,
        featureFlags: [
          {
            name: "enableAccessibilityFeatures",
            active: false,
          },
        ],
        listingFeaturesConfiguration: {
          categories: [
            {
              id: "mobility",
              fields: [{ id: "accessibleParking" }],
            },
          ],
        },
      } as Jurisdiction

      const mockListing: Listing = {
        ...listing,
        listingFeatures: {
          accessibleParking: true,
        } as ListingFeatures,
      }

      const result = getFeatures(mockListing, mockJurisdiction)
      const accessibilityFeature = result.find((f) => f.heading === "Accessibility")
      expect(accessibilityFeature).toBeUndefined()
    })
  })

  describe("getAmiValues", () => {
    it("should extract AMI values from listing units", () => {
      const mockListing: Listing = {
        ...listing,
        unitsSummarized: {
          amiPercentages: ["30", "60", "80"],
        } as UnitsSummarized,
      }

      const result = getAmiValues(mockListing)
      expect(result).toEqual([30, 60, 80])
    })

    it("should handle listing with no units", () => {
      const mockListing: Listing = {
        ...listing,
        unitsSummarized: {
          amiPercentages: [],
        } as UnitsSummarized,
      }

      const result = getAmiValues(mockListing)
      expect(result).toEqual([])
    })
  })

  describe("getMarketingFlyers", () => {
    it("should return empty array when feature flag is disabled", () => {
      const mockJurisdiction = {
        ...jurisdiction,
        featureFlags: [
          {
            name: FeatureFlagEnum.enableMarketingFlyer,
            active: false,
          },
        ],
      } as Jurisdiction

      const mockListing: Listing = {
        ...listing,
        marketingFlyer: "http://example.com/flyer.pdf",
      }

      const result = getMarketingFlyers(mockListing, mockJurisdiction)
      expect(result).toEqual([])
    })

    it("should return marketing flyer when feature flag is enabled and flyer exists", () => {
      const mockJurisdiction = {
        ...jurisdiction,
        featureFlags: [
          {
            name: FeatureFlagEnum.enableMarketingFlyer,
            active: true,
          },
        ],
      } as Jurisdiction

      const mockListing: Listing = {
        ...listing,
        marketingFlyer: "http://example.com/flyer.pdf",
      }

      const result = getMarketingFlyers(mockListing, mockJurisdiction)
      expect(result).toHaveLength(1)
      expect(result[0].url).toBe("http://example.com/flyer.pdf")
      expect(result[0].label).toBe("Open marketing flyer")
    })

    it("should return both marketing and accessible flyer when both exist", () => {
      const mockJurisdiction = {
        ...jurisdiction,
        featureFlags: [
          {
            name: FeatureFlagEnum.enableMarketingFlyer,
            active: true,
          },
        ],
      } as Jurisdiction

      const mockListing: Listing = {
        ...listing,
        marketingFlyer: "http://example.com/flyer.pdf",
        accessibleMarketingFlyer: "http://example.com/accessible-flyer.pdf",
      }

      const result = getMarketingFlyers(mockListing, mockJurisdiction)
      expect(result).toHaveLength(2)
      expect(result[0].url).toBe("http://example.com/flyer.pdf")
      expect(result[1].url).toBe("http://example.com/accessible-flyer.pdf")
      expect(result[1].label).toBe("Open accessible marketing flyer")
    })

    it("should use cloudinary URL when file asset exists", () => {
      const mockJurisdiction = {
        ...jurisdiction,
        featureFlags: [
          {
            name: FeatureFlagEnum.enableMarketingFlyer,
            active: true,
          },
        ],
      } as Jurisdiction

      const mockListing: Listing = {
        ...listing,
        listingsMarketingFlyerFile: {
          id: "1",
          fileId: "test-file-id",
        } as Asset,
      }

      const result = getMarketingFlyers(mockListing, mockJurisdiction)
      expect(result).toHaveLength(1)
      expect(result[0].url).toBe(
        "https://res.cloudinary.com/undefined/image/upload/test-file-id.pdf"
      )
    })

    it("should return empty array when no flyers exist", () => {
      const mockJurisdiction = {
        ...jurisdiction,
        featureFlags: [
          {
            name: FeatureFlagEnum.enableMarketingFlyer,
            active: true,
          },
        ],
      } as Jurisdiction

      const mockListing: Listing = {
        ...listing,
        marketingFlyer: undefined,
        accessibleMarketingFlyer: undefined,
        listingsMarketingFlyerFile: undefined,
        listingsAccessibleMarketingFlyerFile: undefined,
      }

      const result = getMarketingFlyers(mockListing, mockJurisdiction)
      expect(result).toEqual([])
    })
  })

  describe("getAddress", () => {
    it("should return leasing agent address when addressType is leasingAgent", () => {
      const mockListing: Listing = {
        ...listing,
        listingsLeasingAgentAddress: {
          id: "1",
          street: "123 Main St",
          city: "Test City",
          state: "CA",
          zipCode: "12345",
        } as Address,
      }

      const result = getAddress(ApplicationAddressTypeEnum.leasingAgent, undefined, mockListing)
      expect(result?.street).toBe("123 Main St")
    })

    it("should return drop off address when location is dropOff", () => {
      const mockListing: Listing = {
        ...listing,
        listingsApplicationDropOffAddress: {
          id: "2",
          street: "456 Drop Off St",
          city: "Test City",
          state: "CA",
          zipCode: "12345",
        } as Address,
      }

      const result = getAddress(undefined, "dropOff", mockListing)
      expect(result?.street).toBe("456 Drop Off St")
    })

    it("should return pick up address when location is pickUp", () => {
      const mockListing: Listing = {
        ...listing,
        listingsApplicationPickUpAddress: {
          id: "3",
          street: "789 Pick Up St",
          city: "Test City",
          state: "CA",
          zipCode: "12345",
        } as Address,
      }

      const result = getAddress(undefined, "pickUp", mockListing)
      expect(result?.street).toBe("789 Pick Up St")
    })

    it("should return mail in address when location is mailIn", () => {
      const mockListing: Listing = {
        ...listing,
        listingsApplicationMailingAddress: {
          id: "4",
          street: "321 Mail St",
          city: "Test City",
          state: "CA",
          zipCode: "12345",
        } as Address,
      }

      const result = getAddress(undefined, "mailIn", mockListing)
      expect(result?.street).toBe("321 Mail St")
    })
  })

  describe("getReservedTitle", () => {
    it("should return senior title for senior55 reserved community type", () => {
      const result = getReservedTitle({ id: "1", name: "senior55" })
      expect(result).toBe("Senior building")
    })

    it("should return senior title for senior62 reserved community type", () => {
      const result = getReservedTitle({ id: "2", name: "senior62" })
      expect(result).toBe("Senior building")
    })

    it("should return senior title for senior reserved community type", () => {
      const result = getReservedTitle({ id: "3", name: "senior" })
      expect(result).toBe("Senior building")
    })

    it("should return default title for other reserved community types", () => {
      const result = getReservedTitle({ id: "4", name: "veterans" })
      expect(result).toBe("Reserved building")
    })
  })

  describe("getDateString", () => {
    it("should format date with given format string", () => {
      const date = new Date("2024-01-15T10:30:00")
      const result = getDateString(date, "MMMM DD, YYYY")
      expect(result).toBe("January 15, 2024")
    })

    it("should return null for undefined date", () => {
      const result = getDateString(undefined, "MMMM DD, YYYY")
      expect(result).toBeNull()
    })

    it("should format date with different format", () => {
      const date = new Date("2024-01-15T10:30:00")
      const result = getDateString(date, "MM/DD/YYYY")
      expect(result).toBe("01/15/2024")
    })
  })

  describe("getBuildingSelectionCriteria", () => {
    it("should return link when listingsBuildingSelectionCriteriaFile exists", () => {
      const mockListing: Listing = {
        ...listing,
        listingsBuildingSelectionCriteriaFile: {
          id: "1",
          fileId: "test-file-id",
        } as Asset,
      }

      const result = getBuildingSelectionCriteria(mockListing)

      expect(result.props.children.props.href).toEqual(
        "https://res.cloudinary.com/undefined/image/upload/test-file-id.pdf"
      )
    })

    it("should return url content when buildingSelectionCriteria exists", () => {
      const mockListing: Listing = {
        ...listing,
        buildingSelectionCriteria: "Test criteria URL",
        listingsBuildingSelectionCriteriaFile: undefined,
      }

      const result = getBuildingSelectionCriteria(mockListing)
      expect(result.props.children.props.href).toEqual("Test criteria URL")
    })

    it("should return null when neither file nor text exists", () => {
      const mockListing: Listing = {
        ...listing,
        buildingSelectionCriteria: undefined,
        listingsBuildingSelectionCriteriaFile: undefined,
      }

      const result = getBuildingSelectionCriteria(mockListing)
      expect(result).toBeUndefined()
    })
  })
  describe("getEligibilitySections", () => {
    let minimalEligibilitySectionsListing: Listing

    beforeAll(() => {
      //HMI and Occupancy are always returned in the eligibility sections regardless
      minimalEligibilitySectionsListing = {
        ...listing,
        buildingSelectionCriteria: undefined,
        creditHistory: undefined,
        criminalBackground: undefined,
        listingsBuildingSelectionCriteriaFile: undefined,
        listingMultiselectQuestions: [],
        rentalAssistance: undefined,
        rentalHistory: undefined,
        reservedCommunityTypes: undefined,
      }
    })

    it("should return eligibility sections for a listing", () => {
      const mockListing: Listing = {
        ...listing,
        buildingSelectionCriteria: "Test criteria",
        creditHistory: "Good credit required",
        rentalAssistance: "Accepts Section 8",
      }

      const result = getEligibilitySections(jurisdiction, mockListing)
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
    })

    it("should not return a program section in the list if there are no programs", () => {
      const eligibilitySections = getEligibilitySections(
        jurisdiction,
        minimalEligibilitySectionsListing
      )
      expect(eligibilitySections).not.toContainEqual({
        header: "Housing programs",
        note: "One or more questions in the application will help to determine whether or not you are eligible for the housing programs listed above. After you have submitted your application, the property manager will ask you to verify your housing program eligibility by providing documentation or another form of verification.",
        subheader:
          "Some or all of the units for this property are reserved for persons who qualify for the particular housing program(s) listed below. You may need to qualify for one of these programs in order to be eligible for a unit at this property.",
        content: expect.anything(),
      })
      expect(eligibilitySections).not.toContainEqual({
        header: "Community types",
        note: "Affordable housing properties often receive funding to house specific populations, like seniors, residents with disabilities, etc. Properties can serve more than one population. Contact this property if you are unsure if you qualify.",
        subheader: "This program includes opportunities for members of specific communities",
        content: expect.anything(),
      })
    })

    it("should return programs with program copy when swapCommunityTypeWithPrograms is false", () => {
      const eligibilitySections = getEligibilitySections(
        {
          ...jurisdiction,
          featureFlags: [
            {
              name: FeatureFlagEnum.swapCommunityTypeWithPrograms,
              id: "id",
              createdAt: new Date(),
              updatedAt: new Date(),
              active: false,
              description: "",
              jurisdictions: [],
            },
          ],
        },
        {
          ...minimalEligibilitySectionsListing,
          listingMultiselectQuestions: [
            {
              ordinal: 1,
              multiselectQuestions: {
                id: "id",
                createdAt: new Date(),
                updatedAt: new Date(),
                text: "Families",
                jurisdictions: [],
                applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
                status: MultiselectQuestionsStatusEnum.active,
              },
            },
          ],
        }
      )

      expect(eligibilitySections).toContainEqual({
        header: "Housing programs",
        note: "One or more questions in the application will help to determine whether or not you are eligible for the housing programs listed above. After you have submitted your application, the property manager will ask you to verify your housing program eligibility by providing documentation or another form of verification.",
        subheader:
          "Some or all of the units for this property are reserved for persons who qualify for the particular housing program(s) listed below. You may need to qualify for one of these programs in order to be eligible for a unit at this property.",
        content: expect.anything(),
      })
    })

    it("should return programs with community type copy when swapCommunityTypeWithPrograms is true", () => {
      const eligibilitySections = getEligibilitySections(
        {
          ...jurisdiction,
          featureFlags: [
            {
              name: FeatureFlagEnum.swapCommunityTypeWithPrograms,
              id: "id",
              createdAt: new Date(),
              updatedAt: new Date(),
              active: true,
              description: "",
              jurisdictions: [],
            },
          ],
        },
        {
          ...minimalEligibilitySectionsListing,
          listingMultiselectQuestions: [
            {
              ordinal: 1,
              multiselectQuestions: {
                id: "id",
                createdAt: new Date(),
                updatedAt: new Date(),
                text: "Families",
                jurisdictions: [],
                applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
                status: MultiselectQuestionsStatusEnum.active,
              },
            },
          ],
        }
      )

      expect(eligibilitySections).toContainEqual({
        header: "Community types",
        note: "Affordable housing properties often receive funding to house specific populations, like seniors, residents with disabilities, etc. Properties can serve more than one population. Contact this property if you are unsure if you qualify.",
        subheader: "This program includes opportunities for members of specific communities",
        content: expect.anything(),
      })
    })
    it("should return nothing if no data", () => {
      const eligibilitySections = getEligibilitySections(jurisdiction, {
        ...listing,
        units: null,
        reservedCommunityTypes: null,
        listingMultiselectQuestions: [],
        creditHistory: null,
        rentalHistory: null,
        buildingSelectionCriteria: null,
        rentalAssistance: null,
        criminalBackground: null,
      })
      expect(eligibilitySections).toEqual([])
    })
  })
  describe("getCurrencyFromArgumentString", () => {
    it("should return range at end of formatted string", () => {
      expect(getCurrencyFromArgumentString("listings.annualIncome*income:$36,000")).toEqual(
        "$36,000"
      )
      expect(getCurrencyFromArgumentString("listings.monthlyIncome*income:$4,000")).toEqual(
        "$4,000"
      )
      expect(getCurrencyFromArgumentString("listings.annualIncome*income:$60,000-$84,000")).toEqual(
        "$60,000 - $84,000"
      )
    })
  })
  describe("getStackedHmiData", () => {
    it("should return correctly for multiple ami percentages and some ranges", () => {
      expect(
        getStackedHmiData({
          ...listing,
          unitsSummarized: {
            hmi: {
              columns: {
                sizeColumn: "listings.householdSize",
                ami30: "listings.percentAMIUnit*percent:30",
                ami50: "listings.percentAMIUnit*percent:50",
              },
              rows: [
                {
                  sizeColumn: 1,
                  ami30: "listings.annualIncome*income:$36,000-$60,000",
                  ami50: "listings.annualIncome*income:$84,000",
                },
                {
                  sizeColumn: 2,
                  ami30: "listings.annualIncome*income:$48,000-$72,000",
                  ami50: "listings.annualIncome*income:$96,000",
                },
                {
                  sizeColumn: 3,
                  ami30: "listings.annualIncome*income:$60,000-$84,000",
                  ami50: "listings.annualIncome*income:$108,000",
                },
              ],
            },
          } as UnitsSummarized,
        })
      ).toStrictEqual([
        {
          ami30: { cellSubText: "per year", cellText: "$36,000 - $60,000" },
          ami50: { cellSubText: "per year", cellText: "$84,000" },
          sizeColumn: { cellText: 1 },
        },
        {
          ami30: { cellSubText: "per year", cellText: "$48,000 - $72,000" },
          ami50: { cellSubText: "per year", cellText: "$96,000" },
          sizeColumn: { cellText: 2 },
        },
        {
          ami30: { cellSubText: "per year", cellText: "$60,000 - $84,000" },
          ami50: { cellSubText: "per year", cellText: "$108,000" },
          sizeColumn: { cellText: 3 },
        },
      ])
    })

    it("should return correctly for one ami percentage and ranges", () => {
      expect(
        getStackedHmiData({
          ...listing,
          unitsSummarized: {
            hmi: {
              columns: {
                sizeColumn: "listings.householdSize",
                maxIncomeMonth: "listings.maxIncomeMonth",
                maxIncomeYear: "listings.maxIncomeYear",
              },
              rows: [
                {
                  sizeColumn: 1,
                  maxIncomeMonth: "listings.monthlyIncome*income:$3,000-$5,000",
                  maxIncomeYear: "listings.annualIncome*income:$36,000-$60,000",
                },
                {
                  sizeColumn: 2,
                  maxIncomeMonth: "listings.monthlyIncome*income:$4,000-$6,000",
                  maxIncomeYear: "listings.annualIncome*income:$48,000-$72,000",
                },
                {
                  sizeColumn: 3,
                  maxIncomeMonth: "listings.monthlyIncome*income:$5,000-$7,000",
                  maxIncomeYear: "listings.annualIncome*income:$60,000-$84,000",
                },
              ],
            },
          } as UnitsSummarized,
        })
      ).toStrictEqual([
        {
          maxIncomeMonth: { cellSubText: "per month", cellText: "$3,000 - $5,000" },
          maxIncomeYear: { cellSubText: "per year", cellText: "$36,000 - $60,000" },
          sizeColumn: { cellText: 1 },
        },
        {
          maxIncomeMonth: { cellSubText: "per month", cellText: "$4,000 - $6,000" },
          maxIncomeYear: { cellSubText: "per year", cellText: "$48,000 - $72,000" },
          sizeColumn: { cellText: 2 },
        },
        {
          maxIncomeMonth: { cellSubText: "per month", cellText: "$5,000 - $7,000" },
          maxIncomeYear: { cellSubText: "per year", cellText: "$60,000 - $84,000" },
          sizeColumn: { cellText: 3 },
        },
      ])
    })

    it("should return correctly for one ami percentage and no ranges", () => {
      expect(
        getStackedHmiData({
          ...listing,
          unitsSummarized: {
            hmi: {
              columns: {
                sizeColumn: "listings.householdSize",
                maxIncomeMonth: "listings.maxIncomeMonth",
                maxIncomeYear: "listings.maxIncomeYear",
              },
              rows: [
                {
                  sizeColumn: 1,
                  maxIncomeMonth: "listings.monthlyIncome*income:$3,000",
                  maxIncomeYear: "listings.annualIncome*income:$36,000",
                },
                {
                  sizeColumn: 2,
                  maxIncomeMonth: "listings.monthlyIncome*income:$4,000",
                  maxIncomeYear: "listings.annualIncome*income:$48,000",
                },
                {
                  sizeColumn: 3,
                  maxIncomeMonth: "listings.monthlyIncome*income:$5,000",
                  maxIncomeYear: "listings.annualIncome*income:$60,000",
                },
              ],
            },
          } as UnitsSummarized,
        })
      ).toStrictEqual([
        {
          maxIncomeMonth: { cellSubText: "per month", cellText: "$3,000" },
          maxIncomeYear: { cellSubText: "per year", cellText: "$36,000" },
          sizeColumn: { cellText: 1 },
        },
        {
          maxIncomeMonth: { cellSubText: "per month", cellText: "$4,000" },
          maxIncomeYear: { cellSubText: "per year", cellText: "$48,000" },
          sizeColumn: { cellText: 2 },
        },
        {
          maxIncomeMonth: { cellSubText: "per month", cellText: "$5,000" },
          maxIncomeYear: { cellSubText: "per year", cellText: "$60,000" },
          sizeColumn: { cellText: 3 },
        },
      ])
    })

    it("should return correctly for multiple ami percentages and no ranges", () => {
      expect(
        getStackedHmiData({
          ...listing,
          unitsSummarized: {
            hmi: {
              columns: {
                sizeColumn: "listings.householdSize",
                ami30: "listings.percentAMIUnit*percent:30",
                ami60: "listings.percentAMIUnit*percent:60",
              },
              rows: [
                {
                  sizeColumn: 1,
                  ami30: "listings.annualIncome*income:$36,000",
                  ami60: "listings.annualIncome*income:$72,000",
                },
                {
                  sizeColumn: 2,
                  ami30: "listings.annualIncome*income:$48,000",
                  ami60: "listings.annualIncome*income:$84,000",
                },
                {
                  sizeColumn: 3,
                  ami30: "listings.annualIncome*income:$60,000",
                  ami60: "listings.annualIncome*income:$96,000",
                },
              ],
            },
          } as UnitsSummarized,
        })
      ).toStrictEqual([
        {
          ami30: { cellSubText: "per year", cellText: "$36,000" },
          ami60: { cellSubText: "per year", cellText: "$72,000" },
          sizeColumn: { cellText: 1 },
        },
        {
          ami30: { cellSubText: "per year", cellText: "$48,000" },
          ami60: { cellSubText: "per year", cellText: "$84,000" },
          sizeColumn: { cellText: 2 },
        },
        {
          ami30: { cellSubText: "per year", cellText: "$60,000" },
          ami60: { cellSubText: "per year", cellText: "$96,000" },
          sizeColumn: { cellText: 3 },
        },
      ])
    })
  })
  describe("getAdditionalInformation", () => {
    it("should return card content with required documents", () => {
      const mockListing: Listing = {
        ...listing,
        requiredDocumentsList: {
          proofOfIncome: true,
          governmentIssuedId: true,
        },
      }

      const result = getAdditionalInformation(mockListing)
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
      expect(result[0].heading).toBe("Required documents")
    })

    it("should include program rules when available", () => {
      const mockListing: Listing = {
        ...listing,
        programRules: "Test program rules",
        requiredDocumentsList: undefined,
        requiredDocuments: undefined,
      }

      const result = getAdditionalInformation(mockListing)
      expect(result.length).toBeGreaterThan(0)
      expect(result[0].heading).toBe("Important program rules")
    })

    it("should return empty array when no additional information exists", () => {
      const mockListing: Listing = {
        ...listing,
        requiredDocumentsList: undefined,
        requiredDocuments: undefined,
        programRules: undefined,
        specialNotes: undefined,
      }

      const result = getAdditionalInformation(mockListing)
      expect(result).toEqual([])
    })

    it("should handle requiredDocuments for regulated listings", () => {
      const mockListing: Listing = {
        ...listing,
        listingType: EnumListingListingType.regulated,
        requiredDocuments: "Additional required documents",
        requiredDocumentsList: undefined,
      }

      const result = getAdditionalInformation(mockListing)
      expect(result.length).toBeGreaterThan(0)
      expect(result[0].heading).toBe("Required documents")
    })

    it("should use different heading for non-regulated listings", () => {
      const mockListing: Listing = {
        ...listing,
        listingType: EnumListingListingType.nonRegulated,
        requiredDocuments: "Additional info",
        requiredDocumentsList: undefined,
      }

      const result = getAdditionalInformation(mockListing)
      expect(result.length).toBeGreaterThan(0)
      expect(result[0].heading).toBe("Required documents (Additional Info)")
    })
  })
})
