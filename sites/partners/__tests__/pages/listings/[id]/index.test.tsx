/* eslint-disable import/no-named-as-default */
import React from "react"
import { setupServer } from "msw/lib/node"
import { fireEvent, mockNextRouter, render, screen, within } from "../../../testUtils"
import { ListingContext } from "../../../../src/components/listings/ListingContext"
import { jurisdiction, listing, user } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import DetailListingData from "../../../../src/components/listings/PaperListingDetails/sections/DetailListingData"
import DetailListingIntro from "../../../../src/components/listings/PaperListingDetails/sections/DetailListingIntro"
import DetailCommunityType from "../../../../src/components/listings/PaperListingDetails/sections/DetailCommunityType"
import DetailUnits from "../../../../src/components/listings/PaperListingDetails/sections/DetailUnits"
import DetailPreferences from "../../../../src/components/listings/PaperListingDetails/sections/DetailPreferences"
import {
  ApplicationAddressTypeEnum,
  ApplicationMethodsTypeEnum,
  EnumListingListingType,
  FeatureFlagEnum,
  LanguagesEnum,
  ListingEventsTypeEnum,
  ListingsStatusEnum,
  MultiselectQuestionsApplicationSectionEnum,
  MultiselectQuestionsStatusEnum,
  ReviewOrderTypeEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import DetailAdditionalFees from "../../../../src/components/listings/PaperListingDetails/sections/DetailAdditionalFees"
import DetailBuildingFeatures from "../../../../src/components/listings/PaperListingDetails/sections/DetailBuildingFeatures"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { rest } from "msw"
import DetailAdditionalEligibility from "../../../../src/components/listings/PaperListingDetails/sections/DetailAdditionalEligibility"
import DetailAdditionalDetails from "../../../../src/components/listings/PaperListingDetails/sections/DetailAdditionalDetails"
import DetailRankingsAndResults from "../../../../src/components/listings/PaperListingDetails/sections/DetailRankingsAndResults"
import DetailLeasingAgent from "../../../../src/components/listings/PaperListingDetails/sections/DetailLeasingAgent"
import DetailApplicationTypes from "../../../../src/components/listings/PaperListingDetails/sections/DetailApplicationTypes"
import DetailApplicationAddress from "../../../../src/components/listings/PaperListingDetails/sections/DetailApplicationAddress"
import DetailApplicationDates from "../../../../src/components/listings/PaperListingDetails/sections/DetailApplicationDates"
import DetailListingPhotos from "../../../../src/components/listings/PaperListingDetails/sections/DetailListingPhotos"
import DetailListingNotes from "../../../../src/components/listings/PaperListingDetails/sections/DetailNotes"
import ListingDetail, { getServerSideProps } from "../../../../src/pages/listings/[id]"
import DetailPrograms from "../../../../src/components/listings/PaperListingDetails/sections/DetailPrograms"
import DetailListingVerification from "../../../../src/components/listings/PaperListingDetails/sections/DetailListingVerification"

const server = setupServer()

window.scrollTo = jest.fn()

const MOCK_CONTEXT = {
  params: {
    id: "Uvbk5qurpB2WI9V6WnNdH",
  },
  req: {
    headers: {
      "x-forwarded-for": "127.0.0.1",
    },
    socket: {
      remoteAddress: "127.0.0.1",
    },
  },
}

beforeAll(() => {
  mockNextRouter()
  server.listen()
})

beforeEach(() => {
  server.use(rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => res(ctx.json(user))))
})

afterEach(() => {
  server.resetHandlers()
  window.sessionStorage.clear()
})

afterAll(() => {
  server.close()
})

function mockJurisdictionsHaveFeatureFlagOn(
  featureFlag: string,
  overrides?: {
    enableHomeType?: boolean
    enableSection8Question?: boolean
    enableUnitGroups?: boolean
    enableIsVerified?: boolean
    enableMarketingStatus?: boolean
    enableAccessibilityFeatures?: boolean
    enableRegions?: boolean
  }
) {
  switch (featureFlag) {
    case FeatureFlagEnum.enableHomeType:
      return overrides?.enableHomeType ?? true
    case FeatureFlagEnum.enableSection8Question:
      return overrides?.enableSection8Question ?? true
    case FeatureFlagEnum.enableUnitGroups:
      return overrides?.enableUnitGroups ?? false
    case FeatureFlagEnum.enableIsVerified:
      return overrides?.enableIsVerified ?? true
    case FeatureFlagEnum.enableMarketingStatus:
      return overrides?.enableMarketingStatus ?? false
    case FeatureFlagEnum.enableAccessibilityFeatures:
      return overrides?.enableAccessibilityFeatures ?? true
    case FeatureFlagEnum.enableRegions:
      return overrides?.enableRegions ?? true
    default:
      return false
  }
}

describe("listing data", () => {
  describe("should display all listing data", () => {
    it("should display Listing Data section", () => {
      render(
        <ListingContext.Provider
          value={{
            ...listing,
            createdAt: new Date("February 3, 2025, 10:13"),
          }}
        >
          <DetailListingData showJurisdictionName={true} />
        </ListingContext.Provider>
      )

      expect(screen.getByText("Listing data")).toBeInTheDocument()
      expect(screen.getByText("Listing ID")).toBeInTheDocument()
      expect(screen.getByText("Uvbk5qurpB2WI9V6WnNdH")).toBeInTheDocument()
      expect(screen.getByText("Date created")).toBeInTheDocument()
      expect(screen.getByText("02/03/2025 at 10:13 AM")).toBeInTheDocument()
      expect(screen.getByText("Jurisdiction")).toBeInTheDocument()
      expect(screen.getByText("Bloomington")).toBeInTheDocument()
    })

    it("should display Listing Data section but no jurisdiction", () => {
      render(
        <ListingContext.Provider
          value={{
            ...listing,
            createdAt: new Date("February 3, 2025, 10:13"),
          }}
        >
          <DetailListingData showJurisdictionName={false} />
        </ListingContext.Provider>
      )

      expect(screen.getByText("Listing data")).toBeInTheDocument()
      expect(screen.getByText("Listing ID")).toBeInTheDocument()
      expect(screen.getByText("Uvbk5qurpB2WI9V6WnNdH")).toBeInTheDocument()
      expect(screen.getByText("Date created")).toBeInTheDocument()
      expect(screen.getByText("02/03/2025 at 10:13 AM")).toBeInTheDocument()
      expect(screen.queryByText("Jurisdiction")).not.toBeInTheDocument()
    })

    describe("should display Listing Notes section", () => {
      const STATUS_OPTIONS = (Object.values(ListingsStatusEnum) as string[]).filter(
        (item) => item !== ListingsStatusEnum.changesRequested
      )

      it.each(STATUS_OPTIONS)("should hide section for %s status", (status) => {
        render(
          <ListingContext.Provider
            value={{
              ...listing,
              status: status as ListingsStatusEnum,
            }}
          >
            <DetailListingNotes />
          </ListingContext.Provider>
        )

        expect(screen.queryByText("Listing notes")).not.toBeInTheDocument()
        expect(screen.queryByText("Change request summary")).not.toBeInTheDocument()
        expect(screen.queryByText("Test changes")).not.toBeInTheDocument()
        expect(screen.queryByText("Request date")).not.toBeInTheDocument()
        expect(screen.queryByText("01/10/2025")).not.toBeInTheDocument()
        expect(screen.queryByText("Requested by")).not.toBeInTheDocument()
        expect(screen.queryByText("John Test")).not.toBeInTheDocument()
      })

      it("should show Listing Notes section data - no user defined", () => {
        render(
          <ListingContext.Provider
            value={{
              ...listing,
              status: ListingsStatusEnum.changesRequested,
              requestedChanges: "Test changes",
              requestedChangesDate: new Date(2025, 0, 10, 13, 0),
              requestedChangesUser: undefined,
            }}
          >
            <DetailListingNotes />
          </ListingContext.Provider>
        )

        expect(screen.getByText("Listing notes")).toBeInTheDocument()
        expect(screen.getByText("Change request summary")).toBeInTheDocument()
        expect(screen.getByText("Test changes")).toBeInTheDocument()
        expect(screen.getByText("Request date")).toBeInTheDocument()
        expect(screen.getByText("01/10/2025")).toBeInTheDocument()
        expect(screen.queryByText("Requested by")).not.toBeInTheDocument()
        expect(screen.queryByText("John Test")).not.toBeInTheDocument()
      })

      it("should show Listing Notes section data - with user defined", () => {
        render(
          <ListingContext.Provider
            value={{
              ...listing,
              status: ListingsStatusEnum.changesRequested,
              requestedChanges: "Test changes",
              requestedChangesDate: new Date(2025, 0, 10, 13, 0),
              requestedChangesUser: {
                id: "user_id",
                name: "John Test",
              },
            }}
          >
            <DetailListingNotes />
          </ListingContext.Provider>
        )

        expect(screen.getByText("Listing notes")).toBeInTheDocument()
        expect(screen.getByText("Change request summary")).toBeInTheDocument()
        expect(screen.getByText("Test changes")).toBeInTheDocument()
        expect(screen.getByText("Request date")).toBeInTheDocument()
        expect(screen.getByText("01/10/2025")).toBeInTheDocument()
        expect(screen.getByText("Requested by")).toBeInTheDocument()
        expect(screen.getByText("John Test")).toBeInTheDocument()
      })
    })

    describe("should display Listing Intro section", () => {
      it("should display Listing Intro section without listing type selection", () => {
        render(
          <ListingContext.Provider value={listing}>
            <DetailListingIntro />
          </ListingContext.Provider>
        )

        expect(screen.getByText("Listing intro")).toBeInTheDocument()
        expect(screen.getByText("Listing name")).toBeInTheDocument()
        expect(screen.getByText("Archer Studios")).toBeInTheDocument()
        expect(screen.getByText("Housing developer")).toBeInTheDocument()
        expect(screen.getByText("Charities Housing")).toBeInTheDocument()

        expect(screen.queryByText("What kind of listing is this?")).not.toBeInTheDocument()
        expect(screen.queryByText("Regulated")).not.toBeInTheDocument()
        expect(screen.queryByText("Non-regulated")).not.toBeInTheDocument()
        expect(
          screen.queryByText("Has this property received HUD EBLL clearance?")
        ).not.toBeInTheDocument()
      })

      it("should display Listing Intro for regulated listing", () => {
        render(
          <AuthContext.Provider
            value={{
              profile: { ...user, jurisdictions: [jurisdiction], listings: [] },
              doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
                featureFlag === FeatureFlagEnum.enableNonRegulatedListings,
            }}
          >
            <ListingContext.Provider
              value={{
                ...listing,
                listingType: EnumListingListingType.regulated,
              }}
            >
              <DetailListingIntro />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )

        expect(screen.getByText("What kind of listing is this?")).toBeInTheDocument()
        expect(screen.getByText("Regulated")).toBeInTheDocument()
        expect(screen.queryByText("Non-regulated")).not.toBeInTheDocument()
        expect(
          screen.queryByText("Has this property received HUD EBLL clearance?")
        ).not.toBeInTheDocument()
      })

      it("should display Listing Intro for non-regulated listing", () => {
        render(
          <AuthContext.Provider
            value={{
              profile: { ...user, jurisdictions: [jurisdiction], listings: [] },
              doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
                featureFlag === FeatureFlagEnum.enableNonRegulatedListings,
            }}
          >
            <ListingContext.Provider
              value={{
                ...listing,
                listingType: EnumListingListingType.nonRegulated,
              }}
            >
              <DetailListingIntro />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )

        expect(screen.getByText("What kind of listing is this?")).toBeInTheDocument()
        expect(screen.queryByText("Regulated")).not.toBeInTheDocument()
        expect(screen.getByText("Non-regulated")).toBeInTheDocument()
        expect(
          screen.getByText("Has this property received HUD EBLL clearance?")
        ).toBeInTheDocument()
      })
    })

    describe("should display Listing Photos section", () => {
      it("should display section with missing data", () => {
        render(
          <ListingContext.Provider
            value={{
              ...listing,
              listingImages: [],
            }}
          >
            <DetailListingPhotos />
          </ListingContext.Provider>
        )

        expect(screen.getByText("Listing photos")).toBeInTheDocument()
        expect(screen.getByText("None")).toBeInTheDocument()
        expect(screen.queryByText("Preview")).not.toBeInTheDocument()
        expect(screen.queryByText("Primary")).not.toBeInTheDocument()
        expect(screen.queryByText("Primary photo")).not.toBeInTheDocument()
        expect(screen.queryByRole("img")).not.toBeInTheDocument()
      })

      it("should display Lisiting Photo section data", () => {
        render(
          <ListingContext.Provider
            value={{
              ...listing,
              listingImages: [
                {
                  assets: {
                    id: "asset_id_1",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    fileId: "asset_file_id",
                    label: "Asset #1",
                  },
                },
                {
                  assets: {
                    id: "asset_id_2",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    fileId: "asset_file_id",
                    label: "Asset #2",
                  },
                },
              ],
            }}
          >
            <DetailListingPhotos />
          </ListingContext.Provider>
        )

        expect(screen.getByText("Listing photos", { selector: "h2" })).toBeInTheDocument()
        expect(screen.getByText("Preview")).toBeInTheDocument()
        const listingImages = screen.getAllByRole("img")
        expect(listingImages).toHaveLength(2)
        listingImages.forEach((imageElement) => {
          expect(imageElement).toHaveAttribute("src", "asset_file_id")
          expect(imageElement).toHaveAttribute("alt", "Listing photos")
        })
      })
    })

    describe("should display Community Type section", () => {
      it("should display all section data - without disclaimer", () => {
        render(
          <ListingContext.Provider
            value={{
              ...listing,
              reservedCommunityTypes: {
                id: "farm-community",
                name: "farmworkerHousing",
              },
              reservedCommunityDescription: "Test community description",
            }}
          >
            <DetailCommunityType />
          </ListingContext.Provider>
        )

        expect(screen.getByText("Community type")).toBeInTheDocument()
        expect(screen.getByText("Reserved community type")).toBeInTheDocument()
        expect(screen.getByText("Farmworker housing")).toBeInTheDocument()
        expect(screen.getByText("Reserved community description")).toBeInTheDocument()
        expect(screen.getByText("Test community description")).toBeInTheDocument()
        expect(
          screen.getByText(
            "Do you want to include a community type disclaimer as the first page of the application?"
          )
        ).toBeInTheDocument()
        expect(screen.getByText("No")).toBeInTheDocument()
      })

      it("should display all section data - with disclaimer", () => {
        render(
          <ListingContext.Provider
            value={{
              ...listing,
              reservedCommunityTypes: {
                id: "farm-community",
                name: "farmworkerHousing",
              },
              reservedCommunityDescription: "Test community description",
              includeCommunityDisclaimer: true,
              communityDisclaimerTitle: "Test Disclaimer Title",
              communityDisclaimerDescription: "Test Disclaimer Description",
            }}
          >
            <DetailCommunityType />
          </ListingContext.Provider>
        )

        expect(screen.getByText("Community type")).toBeInTheDocument()
        expect(screen.getByText("Reserved community type")).toBeInTheDocument()
        expect(screen.getByText("Farmworker housing")).toBeInTheDocument()
        expect(screen.getByText("Reserved community description")).toBeInTheDocument()
        expect(screen.getByText("Test community description")).toBeInTheDocument()
        expect(
          screen.getByText(
            "Do you want to include a community type disclaimer as the first page of the application?"
          )
        ).toBeInTheDocument()
        expect(screen.getByText("Yes")).toBeInTheDocument()
        expect(screen.getByText("Test Disclaimer Title")).toBeInTheDocument()
        expect(screen.getByText("Test Disclaimer Description")).toBeInTheDocument()
      })

      const COMMUNITY_TYPES = [
        {
          dtoField: "developmentalDisability",
          typeString: "Developmental disability",
        },
        {
          dtoField: "farmworkerHousing",
          typeString: "Farmworker housing",
        },
        {
          dtoField: "housingVoucher",
          typeString: "HCV/Section 8 Voucher",
        },
        {
          dtoField: "senior",
          typeString: "Seniors",
        },
        {
          dtoField: "senior55",
          typeString: "Seniors 55+",
        },
        {
          dtoField: "senior62",
          typeString: "Seniors 62+",
        },
        {
          dtoField: "specialNeeds",
          typeString: "Special needs",
        },
        {
          dtoField: "veteran",
          typeString: "Veteran",
        },
        {
          dtoField: "schoolEmployee",
          typeString: "School employee",
        },
      ].map((data) =>
        Object.assign(data, {
          toString: function () {
            return this.typeString
          },
        })
      )

      it.each(COMMUNITY_TYPES)(`Should display %s type`, (item) => {
        const { typeString, dtoField } = item
        render(
          <ListingContext.Provider
            value={{
              ...listing,
              reservedCommunityTypes: {
                id: `${dtoField}Id`,
                name: dtoField,
              },
            }}
          >
            <DetailCommunityType />
          </ListingContext.Provider>
        )

        expect(screen.getByText(typeString))
      })
    })

    it("should display missing Listing Units section", () => {
      render(
        <ListingContext.Provider
          value={{
            ...listing,
            section8Acceptance: false,
            units: [],
          }}
        >
          <DetailUnits setUnitDrawer={() => jest.fn()} />
        </ListingContext.Provider>
      )

      expect(
        screen.getByText("Do you want to show unit types or individual units?")
      ).toBeInTheDocument()
      expect(screen.getByText("Individual units")).toBeInTheDocument()
      expect(screen.getByText("What is the listing availability?")).toBeInTheDocument()
      expect(screen.getByText("Available units")).toBeInTheDocument()
      expect(screen.getByText("None")).toBeInTheDocument()

      expect(screen.queryByText("Unit #")).not.toBeInTheDocument()
      expect(screen.queryByText("Unit type")).not.toBeInTheDocument()
      expect(screen.queryByText("AMI")).not.toBeInTheDocument()
      expect(screen.queryByText("Rent")).not.toBeInTheDocument()
      expect(screen.queryByText("SQ FT")).not.toBeInTheDocument()
      expect(screen.queryByText("ADA")).not.toBeInTheDocument()
      expect(
        screen.queryByText("Do you accept Section 8 Housing Choice Vouchers?")
      ).not.toBeInTheDocument()
      expect(screen.queryByText("No")).not.toBeInTheDocument()
    })

    it("should display Listing Units section", () => {
      render(
        <AuthContext.Provider
          value={{
            profile: { ...user, jurisdictions: [], listings: [] },
            doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
              mockJurisdictionsHaveFeatureFlagOn(featureFlag),
          }}
        >
          <ListingContext.Provider
            value={{
              ...listing,
              units: listing.units.map((entry, idx) => ({
                ...entry,
                number: `#${idx + 1}`,
                unitAccessibilityPriorityTypes: {
                  id: `ada_${idx}`,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  name: `Test ADA_${idx}`,
                },
              })),
              section8Acceptance: true,
            }}
          >
            <DetailUnits setUnitDrawer={() => jest.fn()} />
          </ListingContext.Provider>
        </AuthContext.Provider>
      )

      expect(
        screen.getByText("Do you want to show unit types or individual units?")
      ).toBeInTheDocument()
      expect(screen.getByText("Individual units")).toBeInTheDocument()
      expect(screen.getByText("What is the listing availability?")).toBeInTheDocument()
      expect(screen.getByText("Available units")).toBeInTheDocument()

      expect(screen.getByText("Unit #")).toBeInTheDocument()
      expect(screen.getByText("Unit type")).toBeInTheDocument()
      expect(screen.getByText("AMI")).toBeInTheDocument()
      expect(screen.getByText("Rent")).toBeInTheDocument()
      expect(screen.getByText("SQ FT")).toBeInTheDocument()
      expect(screen.getByText("ADA")).toBeInTheDocument()

      expect(screen.getAllByText(/#[1-9]/i)).toHaveLength(6)
      expect(screen.getAllByText("Studio")).toHaveLength(6)
      expect(screen.getAllByText("45.0")).toHaveLength(6)
      expect(screen.getAllByText("1104.0")).toHaveLength(6)
      expect(screen.getAllByText("285")).toHaveLength(6)
      expect(screen.getAllByText(/Test ADA_\d{1}/)).toHaveLength(6)
      expect(screen.getAllByText("View")).toHaveLength(6)

      expect(
        screen.getByText("Do you accept Section 8 Housing Choice Vouchers?")
      ).toBeInTheDocument()
      expect(screen.getByText("Yes")).toBeInTheDocument()
    })

    it("should display missing Housing Preferences section", () => {
      render(
        <ListingContext.Provider value={{ ...listing, listingMultiselectQuestions: [] }}>
          <DetailPreferences />
        </ListingContext.Provider>
      )

      expect(screen.getByText("Housing preferences")).toBeInTheDocument()
      expect(screen.getByText("Active preferences")).toBeInTheDocument()
      expect(screen.getByText("None")).toBeInTheDocument()
      expect(screen.queryByText("Order")).not.toBeInTheDocument()
      expect(screen.queryByText("Name")).not.toBeInTheDocument()
      expect(screen.queryByText("Description")).not.toBeInTheDocument()
    })

    it("should display Housing Preferences section", () => {
      render(
        <ListingContext.Provider
          value={{
            ...listing,
            listingMultiselectQuestions: [
              {
                multiselectQuestions: {
                  id: "preference_id_0",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  jurisdictions: [],
                  text: "Test Name_1",
                  description: "Test Description_1",
                  applicationSection: MultiselectQuestionsApplicationSectionEnum.preferences,
                  status: MultiselectQuestionsStatusEnum.active,
                },
              },
              {
                multiselectQuestions: {
                  id: "preference_id_1",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  jurisdictions: [],
                  text: "Test Name_2",
                  description: "Test Description_2",
                  applicationSection: MultiselectQuestionsApplicationSectionEnum.preferences,
                  status: MultiselectQuestionsStatusEnum.active,
                },
              },
            ],
          }}
        >
          <DetailPreferences />
        </ListingContext.Provider>
      )

      expect(screen.getByText("Housing preferences")).toBeInTheDocument()
      expect(screen.getByText("Active preferences")).toBeInTheDocument()
      expect(screen.getByText("Order")).toBeInTheDocument()
      expect(screen.getByText("1")).toBeInTheDocument()
      expect(screen.getByText("2")).toBeInTheDocument()
      expect(screen.getByText("Name")).toBeInTheDocument()
      expect(screen.getAllByText(/Test Name_\d{1}/)).toHaveLength(2)
      expect(screen.getByText("Description")).toBeInTheDocument()
      expect(screen.getAllByText(/Test Description_\d{1}/)).toHaveLength(2)
    })

    it("should display Housing Programs section", () => {
      render(
        <ListingContext.Provider
          value={{
            ...listing,
            listingMultiselectQuestions: [
              {
                multiselectQuestions: {
                  id: "program_id_0",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  jurisdictions: [],
                  text: "Test Program Name_1",
                  description: "Test Program Description_1",
                  applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
                  status: MultiselectQuestionsStatusEnum.draft,
                },
              },
              {
                multiselectQuestions: {
                  id: "program_id_1",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  jurisdictions: [],
                  text: "Test Program Name_2",
                  description: "Test Program Description_2",
                  applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
                  status: MultiselectQuestionsStatusEnum.draft,
                },
              },
            ],
          }}
        >
          <DetailPrograms />
        </ListingContext.Provider>
      )

      expect(screen.getByText("Housing programs")).toBeInTheDocument()
      expect(screen.getByText("Active programs")).toBeInTheDocument()
      expect(screen.getByText("Order")).toBeInTheDocument()
      expect(screen.getByText("1")).toBeInTheDocument()
      expect(screen.getByText("2")).toBeInTheDocument()
      expect(screen.getByText("Name")).toBeInTheDocument()
      expect(screen.getAllByText(/Test Program Name_\d{1}/)).toHaveLength(2)
      expect(screen.getByText("Description")).toBeInTheDocument()
      expect(screen.getAllByText(/Test Program Description_\d{1}/)).toHaveLength(2)
    })

    it("should display Additional Fees section", () => {
      render(
        <ListingContext.Provider
          value={{
            ...listing,
            depositMax: "1000",
            depositHelperText: "Test Deposit Helper Text",
            costsNotIncluded:
              "Resident responsible for PG&E, internet and phone. Owner pays for water, trash, and sewage.",
          }}
        >
          <DetailAdditionalFees />
        </ListingContext.Provider>
      )

      expect(screen.getByText("Additional fees")).toBeInTheDocument()
      expect(screen.getByText("Application fee")).toBeInTheDocument()
      expect(screen.getByText("30.0")).toBeInTheDocument()
      expect(screen.getByText("Deposit helper text")).toBeInTheDocument()
      expect(screen.getByText("Test Deposit Helper Text")).toBeInTheDocument()
      expect(screen.getByText("Costs not included")).toBeInTheDocument()
      expect(
        screen.getByText(
          "Resident responsible for PG&E, internet and phone. Owner pays for water, trash, and sewage."
        )
      ).toBeInTheDocument()
    })

    describe("should display Building Features section", () => {
      it("should display data with no accessibility features", () => {
        render(
          <ListingContext.Provider
            value={{
              ...listing,
              servicesOffered: "Professional Help",
            }}
          >
            <DetailBuildingFeatures />
          </ListingContext.Provider>
        )

        expect(screen.getByText("Building features")).toBeInTheDocument()
        expect(screen.getByText("Property amenities")).toBeInTheDocument()
        expect(
          screen.getByText(
            "Community Room, Laundry Room, Assigned Parking, Bike Storage, Roof Top Garden, Part-time Resident Service Coordinator"
          )
        ).toBeInTheDocument()
        expect(screen.getByText("Unit amenities")).toBeInTheDocument()
        expect(screen.getByText("Dishwasher")).toBeInTheDocument()
        expect(screen.getByText("Additional accessibility")).toBeInTheDocument()
        expect(
          screen.getByText(
            "There is a total of 5 ADA units in the complex, all others are adaptable. Exterior Wheelchair ramp (front entry)"
          )
        ).toBeInTheDocument()
        expect(screen.getByText("Smoking policy")).toBeInTheDocument()
        expect(screen.getByText("Non-smoking building")).toBeInTheDocument()
        expect(screen.getByText("Pets policy")).toBeInTheDocument()
        expect(
          screen.getByText(
            "No pets allowed. Accommodation animals may be granted to persons with disabilities via a reasonable accommodation request."
          )
        ).toBeInTheDocument()
        expect(screen.getByText("Services offered")).toBeInTheDocument()
        expect(screen.getByText("Services offered")).toBeInTheDocument()
        expect(screen.getByText("Professional Help")).toBeInTheDocument()
      })

      it("should display accessibility features", () => {
        document.cookie = "access-token-available=True"
        server.use(
          rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
            return res(ctx.json(user))
          })
        )

        render(
          <AuthContext.Provider
            value={{
              profile: {
                ...user,
                jurisdictions: [],
                listings: [],
              },
              doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
                mockJurisdictionsHaveFeatureFlagOn(featureFlag),
            }}
          >
            <ListingContext.Provider
              value={{
                ...listing,
                listingFeatures: {
                  elevator: true,
                  wheelchairRamp: true,
                  serviceAnimalsAllowed: true,
                  accessibleParking: true,
                  parkingOnSite: true,
                  inUnitWasherDryer: true,
                  laundryInBuilding: true,
                  barrierFreeEntrance: true,
                  rollInShower: true,
                  grabBars: true,
                  heatingInUnit: true,
                  acInUnit: true,
                  hearing: true,
                  visual: true,
                  mobility: true,
                  barrierFreeUnitEntrance: true,
                  loweredLightSwitch: true,
                  barrierFreeBathroom: true,
                  wideDoorways: true,
                  loweredCabinets: true,
                  id: "1",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              }}
            >
              <DetailBuildingFeatures />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )

        expect(screen.getByText("Elevator")).toBeInTheDocument()
        expect(screen.getByText("Wheelchair ramp")).toBeInTheDocument()
        expect(screen.getByText("Service animals allowed")).toBeInTheDocument()
        expect(screen.getByText("Accessible parking spots")).toBeInTheDocument()
        expect(screen.getByText("Parking on site")).toBeInTheDocument()
        expect(screen.getByText("In-unit washer/dryer")).toBeInTheDocument()
        expect(screen.getByText("Laundry in building")).toBeInTheDocument()
        expect(screen.getByText("Barrier-free (no-step) property entrance")).toBeInTheDocument()
        expect(screen.getByText("Roll-in showers")).toBeInTheDocument()
        expect(screen.getByText("Grab bars in bathrooms")).toBeInTheDocument()
        expect(screen.getByText("Heating in unit")).toBeInTheDocument()
        expect(screen.getByText("AC in unit")).toBeInTheDocument()
        expect(
          screen.getByText("Units for those with hearing accessibility needs")
        ).toBeInTheDocument()
        expect(
          screen.getByText("Units for those with vision accessibility needs")
        ).toBeInTheDocument()
        expect(
          screen.getByText("Units for those with mobility accessibility needs")
        ).toBeInTheDocument()
        expect(screen.getByText("Lowered cabinets and countertops")).toBeInTheDocument()
        expect(screen.getByText("Lowered light switches")).toBeInTheDocument()
        expect(screen.getByText("Wide unit doorways for wheelchairs")).toBeInTheDocument()
        expect(screen.getByText("Barrier-free bathrooms")).toBeInTheDocument()
        expect(screen.getByText("Barrier-free (no-step) unit entrances"))
      })
    })

    describe("should display Additional Eligibility Rules section", () => {
      it("should display data with selection criteria", () => {
        render(
          <ListingContext.Provider
            value={{
              ...listing,
            }}
          >
            <DetailAdditionalEligibility />
          </ListingContext.Provider>
        )

        expect(screen.getByText("Additional eligibility rules")).toBeInTheDocument()
        expect(screen.getByText("Credit history")).toBeInTheDocument()
        expect(
          // Look only for part of the text to verify that content rendered properly
          screen.getByText(
            /Applications will be rated on a score system for housing. An applicant's score may be impacted by negative tenant peformance information provided to the credit reporting agency./
          )
        ).toBeInTheDocument()
        expect(screen.getByText("Rental history")).toBeInTheDocument()
        expect(
          // Look only for part of the text to verify that content rendered properly
          screen.getByText(
            /Two years of rental history will be verified with all applicable landlords./
          )
        ).toBeInTheDocument()
        expect(screen.getByText("Criminal background")).toBeInTheDocument()
        expect(
          // Look only for part of the text to verify that content rendered properly
          screen.getByText(
            /A criminal background investigation will be obtained on each applicant./
          )
        ).toBeInTheDocument()
        expect(screen.getByText("Rental assistance")).toBeInTheDocument()
        expect(screen.getByText("Custom rental assistance")).toBeInTheDocument()
        expect(screen.getByText("Building selection criteria")).toBeInTheDocument()
        expect(screen.getByText("URL")).toBeInTheDocument()
        expect(
          screen.getByText(
            "Tenant Selection Criteria will be available to all applicants upon request."
          )
        ).toBeInTheDocument()
        expect(screen.queryByText("Preview")).not.toBeInTheDocument()
        expect(screen.queryByText("File name")).not.toBeInTheDocument()
      })

      it("should display selection criteria file", async () => {
        render(
          <ListingContext.Provider
            value={{
              ...listing,
              listingsBuildingSelectionCriteriaFile: {
                id: "test_file_id",
                createdAt: new Date(),
                updatedAt: new Date(),
                fileId: "example_file",
                label: "Test label",
              },
            }}
          >
            <DetailAdditionalEligibility />
          </ListingContext.Provider>
        )

        expect(screen.getByText("Preview")).toBeInTheDocument()
        expect(screen.getByText("File name")).toBeInTheDocument()
        expect(screen.getByText("example_file.pdf")).toBeInTheDocument()
        expect(screen.getByText("Preview")).toBeInTheDocument()

        const previewImage = await screen.findByRole("img")
        expect(previewImage).toBeInTheDocument()
        expect(previewImage).toHaveAttribute(
          "src",
          "https://res.cloudinary.com/exygy/image/upload/w_400,c_limit,q_65/example_file.jpg"
        )
        expect(previewImage).toHaveAttribute("alt", "PDF preview")
      })
    })

    describe("should display Additional Details section", () => {
      it("should display Additional Details section for regulated listings", () => {
        render(
          <ListingContext.Provider
            value={{
              ...listing,
            }}
          >
            <DetailAdditionalDetails />
          </ListingContext.Provider>
        )

        expect(screen.getByText("Required documents")).toBeInTheDocument()
        expect(
          screen.getByText("Completed application and government issued IDs")
        ).toBeInTheDocument()
        expect(screen.getByText("Important program rules")).toBeInTheDocument()
        expect(
          screen.getByText(
            "Applicants must adhere to minimum & maximum income limits. Tenant Selection Criteria applies."
          )
        ).toBeInTheDocument()
        expect(screen.getByText("Special notes")).toBeInTheDocument()
        expect(screen.getByText("Special notes description")).toBeInTheDocument()
      })

      it("shoudld display Additional Details section for non-regulated listings - show all documents options", () => {
        render(
          <AuthContext.Provider
            value={{
              profile: { ...user, listings: [], jurisdictions: [jurisdiction] },
              doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
                featureFlag === FeatureFlagEnum.enableNonRegulatedListings,
            }}
          >
            <ListingContext.Provider
              value={{
                ...listing,
                listingType: EnumListingListingType.nonRegulated,
                requiredDocumentsList: {
                  socialSecurityCard: true,
                  currentLandlordReference: true,
                  birthCertificate: true,
                  previousLandlordReference: true,
                  governmentIssuedId: true,
                  proofOfAssets: true,
                  proofOfIncome: true,
                  residencyDocuments: true,
                  proofOfCustody: true,
                },
              }}
            >
              <DetailAdditionalDetails />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )

        const requiredDocumentsListTitle = screen.getByText("Required documents")
        expect(requiredDocumentsListTitle).toBeInTheDocument()
        const requiredDocumentsListContainer = requiredDocumentsListTitle.parentElement

        expect(
          within(requiredDocumentsListContainer).getByText("Social Security card")
        ).toBeInTheDocument()
        expect(
          within(requiredDocumentsListContainer).getByText("Current landlord reference")
        ).toBeInTheDocument()
        expect(
          within(requiredDocumentsListContainer).getByText(
            "Birth Certificate (all household members 18+)"
          )
        ).toBeInTheDocument()
        expect(
          within(requiredDocumentsListContainer).getByText("Previous landlord reference")
        ).toBeInTheDocument()
        expect(
          within(requiredDocumentsListContainer).getByText(
            "Government-issued ID (all household members 18+)"
          )
        ).toBeInTheDocument()
        expect(
          within(requiredDocumentsListContainer).getByText(
            "Proof of Assets (bank statements, etc.)"
          )
        ).toBeInTheDocument()
        expect(
          within(requiredDocumentsListContainer).getByText(
            "Proof of household income (check stubs, W-2, etc.)"
          )
        ).toBeInTheDocument()
        expect(
          within(requiredDocumentsListContainer).getByText(
            "Immigration/Residency documents (green card, etc.)"
          )
        ).toBeInTheDocument()
        expect(
          within(requiredDocumentsListContainer).getByText("Proof of Custody/Guardianship")
        ).toBeInTheDocument()

        expect(screen.getByText("Required documents (Additional Info)")).toBeInTheDocument()
      })

      it("shoudld display Additional Details section for non-regulated listings - show partial documents options", () => {
        render(
          <AuthContext.Provider
            value={{
              profile: { ...user, listings: [], jurisdictions: [jurisdiction] },
              doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
                featureFlag === FeatureFlagEnum.enableNonRegulatedListings,
            }}
          >
            <ListingContext.Provider
              value={{
                ...listing,
                listingType: EnumListingListingType.nonRegulated,
                requiredDocumentsList: {
                  socialSecurityCard: true,
                  currentLandlordReference: true,
                  birthCertificate: true,
                  previousLandlordReference: true,
                  governmentIssuedId: false,
                  proofOfAssets: false,
                  proofOfIncome: false,
                  residencyDocuments: false,
                  proofOfCustody: false,
                },
              }}
            >
              <DetailAdditionalDetails />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )

        const requiredDocumentsListTitle = screen.getByText("Required documents")
        expect(requiredDocumentsListTitle).toBeInTheDocument()
        const requiredDocumentsListContainer = requiredDocumentsListTitle.parentElement

        expect(
          within(requiredDocumentsListContainer).getByText("Social Security card")
        ).toBeInTheDocument()
        expect(
          within(requiredDocumentsListContainer).getByText("Current landlord reference")
        ).toBeInTheDocument()
        expect(
          within(requiredDocumentsListContainer).getByText(
            "Birth Certificate (all household members 18+)"
          )
        ).toBeInTheDocument()
        expect(
          within(requiredDocumentsListContainer).getByText("Previous landlord reference")
        ).toBeInTheDocument()
        expect(
          within(requiredDocumentsListContainer).queryByText(
            "Government-issued ID (all household members 18+)"
          )
        ).not.toBeInTheDocument()
        expect(
          within(requiredDocumentsListContainer).queryByText(
            "Proof of Assets (bank statements, etc.)"
          )
        ).not.toBeInTheDocument()
        expect(
          within(requiredDocumentsListContainer).queryByText(
            "Proof of household income (check stubs, W-2, etc.)"
          )
        ).not.toBeInTheDocument()
        expect(
          within(requiredDocumentsListContainer).queryByText(
            "Immigration/Residency documents (green card, etc.)"
          )
        ).not.toBeInTheDocument()
        expect(
          within(requiredDocumentsListContainer).queryByText("Proof of Custody/Guardianship")
        ).not.toBeInTheDocument()

        expect(screen.getByText("Required documents (Additional Info)")).toBeInTheDocument()
      })
    })

    describe("should display Rankings & Results section", () => {
      it("should display data for waitlist review order typy without lottery event", () => {
        render(
          <ListingContext.Provider
            value={{
              ...listing,
              reviewOrderType: ReviewOrderTypeEnum.waitlist,
              listingEvents: [],
              isWaitlistOpen: true,
              waitlistOpenSpots: 4,
            }}
          >
            <DetailRankingsAndResults />
          </ListingContext.Provider>
        )

        expect(screen.getByText("Rankings & results")).toBeInTheDocument()
        expect(screen.getByText("Do you want to show a waitlist size?")).toBeInTheDocument()
        expect(screen.getByText("Yes")).toBeInTheDocument()
        expect(screen.getByText("Number of openings")).toBeInTheDocument()
        expect(
          screen.getByText("Tell the applicant what to expect from the process")
        ).toBeInTheDocument()
        expect(
          screen.getByText(
            "Applicant will be contacted. All info will be verified. Be prepared if chosen."
          )
        ).toBeInTheDocument()

        expect(
          screen.queryByText("How is the application review order determined?")
        ).not.toBeInTheDocument()
        expect(screen.queryByText("Lottery")).not.toBeInTheDocument()
        expect(screen.queryByText("First come first serve")).not.toBeInTheDocument()
        expect(
          screen.queryByText("Will the lottery be run in the partner portal?")
        ).not.toBeInTheDocument()
        expect(screen.queryByText("When will the lottery be run?")).not.toBeInTheDocument()
        expect(screen.queryByText("Lottery start time")).not.toBeInTheDocument()
        expect(screen.queryByText("Lottery end time")).not.toBeInTheDocument()
        expect(screen.queryByText("Lottery date notes")).not.toBeInTheDocument()
      })

      it("should display data for first come first serve review order typy without lottery event", () => {
        render(
          <ListingContext.Provider
            value={{
              ...listing,
              reviewOrderType: ReviewOrderTypeEnum.firstComeFirstServe,
              listingEvents: [],
              isWaitlistOpen: true,
              waitlistOpenSpots: 4,
            }}
          >
            <DetailRankingsAndResults />
          </ListingContext.Provider>
        )

        expect(screen.getByText("Rankings & results")).toBeInTheDocument()
        expect(
          screen.getByText("How is the application review order determined?")
        ).toBeInTheDocument()
        expect(screen.getByText("First come first serve")).toBeInTheDocument()
        expect(
          screen.getByText("Tell the applicant what to expect from the process")
        ).toBeInTheDocument()
        expect(
          screen.getByText(
            "Applicant will be contacted. All info will be verified. Be prepared if chosen."
          )
        ).toBeInTheDocument()

        expect(screen.queryByText("Do you want to show a waitlist size?")).not.toBeInTheDocument()
        expect(screen.queryByText("Yes")).not.toBeInTheDocument()
        expect(screen.queryByText("Number of Openings")).not.toBeInTheDocument()
        expect(screen.queryByText("Lottery")).not.toBeInTheDocument()
        expect(
          screen.queryByText("Will the lottery be run in the partner portal?")
        ).not.toBeInTheDocument()
        expect(screen.queryByText("When will the lottery be run?")).not.toBeInTheDocument()
        expect(screen.queryByText("Lottery start time")).not.toBeInTheDocument()
        expect(screen.queryByText("Lottery end time")).not.toBeInTheDocument()
        expect(screen.queryByText("Lottery date notes")).not.toBeInTheDocument()
      })

      it("should display data for lottery serve review order typy with lottery event", () => {
        process.env.showLottery = "true"
        render(
          <ListingContext.Provider
            value={{
              ...listing,
              reviewOrderType: ReviewOrderTypeEnum.lottery,
              listingEvents: [
                {
                  id: "event_id_1",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  type: ListingEventsTypeEnum.publicLottery,
                  startDate: new Date(2024, 1, 18, 10, 30),
                  startTime: new Date(2024, 1, 18, 10, 30),
                  endTime: new Date(2024, 1, 18, 12, 15),
                  note: "Test lottery note",
                },
              ],
              isWaitlistOpen: true,
              waitlistOpenSpots: 4,
            }}
          >
            <DetailRankingsAndResults />
          </ListingContext.Provider>
        )

        expect(screen.getByText("Rankings & results")).toBeInTheDocument()
        expect(
          screen.getByText("How is the application review order determined?")
        ).toBeInTheDocument()
        expect(screen.getByText("Lottery")).toBeInTheDocument()
        expect(
          screen.getByText("Will the lottery be run in the partner portal?")
        ).toBeInTheDocument()
        expect(screen.getByText("No")).toBeInTheDocument()
        expect(screen.getByText("When will the lottery be run?")).toBeInTheDocument()
        expect(screen.getByText("02/18/2024")).toBeInTheDocument()
        expect(screen.getByText("Lottery start time")).toBeInTheDocument()
        expect(screen.getByText("10:30 AM")).toBeInTheDocument()
        expect(screen.getByText("Lottery end time")).toBeInTheDocument()
        expect(screen.getByText("12:15 PM")).toBeInTheDocument()
        expect(screen.getByText("Lottery date notes")).toBeInTheDocument()
        expect(screen.getByText("Test lottery note")).toBeInTheDocument()
        expect(
          screen.getByText("Tell the applicant what to expect from the process")
        ).toBeInTheDocument()
        expect(
          screen.getByText(
            "Applicant will be contacted. All info will be verified. Be prepared if chosen."
          )
        ).toBeInTheDocument()

        expect(screen.queryByText("Do you want to show a waitlist size?")).not.toBeInTheDocument()
        expect(screen.queryByText("Yes")).not.toBeInTheDocument()
        expect(screen.queryByText("Number of openings")).not.toBeInTheDocument()
        expect(screen.queryByText("First come first serve")).not.toBeInTheDocument()
      })
    })

    it("should display Leasing Agent section", () => {
      render(
        <ListingContext.Provider
          value={{
            ...listing,
            leasingAgentTitle: "Pro Agent",
            listingsLeasingAgentAddress: {
              ...listing.listingsLeasingAgentAddress,
              street2: "#12",
            },
          }}
        >
          <DetailLeasingAgent />
        </ListingContext.Provider>
      )

      expect(screen.getByText("Leasing agent")).toBeInTheDocument()
      expect(screen.getByText("Leasing agent name")).toBeInTheDocument()
      expect(screen.getByText("Marisela Baca")).toBeInTheDocument()
      expect(screen.getByText("Email")).toBeInTheDocument()
      expect(screen.getByText("mbaca@charitieshousing.org")).toBeInTheDocument()
      expect(screen.getByText("Phone")).toBeInTheDocument()
      expect(screen.getByText("(408) 217-8562")).toBeInTheDocument()
      expect(screen.getByText("Leasing agent title")).toBeInTheDocument()
      expect(screen.getByText("Pro Agent")).toBeInTheDocument()
      expect(screen.getByText("Office hours")).toBeInTheDocument()
      expect(screen.getByText("Monday, Tuesday & Friday, 9:00AM - 5:00PM")).toBeInTheDocument()
      expect(screen.getByText("Leasing agent address")).toBeInTheDocument()
      expect(screen.getByText("Street address or PO box")).toBeInTheDocument()
      expect(screen.getByText("98 Archer Street")).toBeInTheDocument()
      expect(screen.getByText("Apt or unit #")).toBeInTheDocument()
      expect(screen.getByText("#12")).toBeInTheDocument()
      expect(screen.getByText("City")).toBeInTheDocument()
      expect(screen.getByText("San Jose")).toBeInTheDocument()
      expect(screen.getByText("State")).toBeInTheDocument()
      expect(screen.getByText("CA")).toBeInTheDocument()
      expect(screen.getByText("Zip code")).toBeInTheDocument()
      expect(screen.getByText("95112")).toBeInTheDocument()
    })

    describe("should display Application Types section", () => {
      it("should display section with missing data", () => {
        render(
          <ListingContext.Provider
            value={{
              ...listing,
              commonDigitalApplication: undefined,
              applicationMethods: [],
            }}
          >
            <DetailApplicationTypes />
          </ListingContext.Provider>
        )

        expect(screen.getByText("Application types")).toBeInTheDocument()
        expect(screen.getByText("Online applications")).toBeInTheDocument()
        expect(screen.getByText("Paper applications")).toBeInTheDocument()
        expect(screen.getByText("Referral")).toBeInTheDocument()
        expect(screen.getAllByText("n/a")).toHaveLength(3)
        expect(screen.queryByText("Common digital application")).not.toBeInTheDocument()
        expect(screen.queryByText("Referral contact phone")).not.toBeInTheDocument()
        expect(screen.queryByText("Referral summary")).not.toBeInTheDocument()
        expect(screen.queryByText("Custom online application URL")).not.toBeInTheDocument()
        expect(screen.queryByText("File name")).not.toBeInTheDocument()
        expect(screen.queryByText("Language")).not.toBeInTheDocument()
      })

      it("should display section data - for internal application", () => {
        render(
          <ListingContext.Provider
            value={{
              ...listing,
              applicationMethods: [
                {
                  id: "method_id",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  type: ApplicationMethodsTypeEnum.Internal,
                  externalReference: "Test Reference",
                },
              ],
              digitalApplication: true,
              paperApplication: true,
              referralOpportunity: true,
            }}
          >
            <DetailApplicationTypes />
          </ListingContext.Provider>
        )

        expect(screen.getByText("Application types")).toBeInTheDocument()
        expect(screen.getByText("Online applications")).toBeInTheDocument()
        expect(screen.getByText("Common digital application")).toBeInTheDocument()
        expect(screen.getByText("Paper applications")).toBeInTheDocument()
        expect(screen.getByText("Referral")).toBeInTheDocument()
        expect(screen.getAllByText("Yes")).toHaveLength(4)
        expect(screen.queryByText("Referral contact phone")).not.toBeInTheDocument()
        expect(screen.queryByText("Referral summary")).not.toBeInTheDocument()
        expect(screen.queryByText("Custom online application URL")).not.toBeInTheDocument()
        expect(screen.queryByText("File name")).not.toBeInTheDocument()
        expect(screen.queryByText("Language")).not.toBeInTheDocument()
      })

      it("should display section data - for external application", () => {
        render(
          <ListingContext.Provider
            value={{
              ...listing,
              applicationMethods: [
                {
                  id: "method_id",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  type: ApplicationMethodsTypeEnum.ExternalLink,
                  externalReference: "Test reference",
                },
              ],
              digitalApplication: false,
              paperApplication: false,
              referralOpportunity: false,
            }}
          >
            <DetailApplicationTypes />
          </ListingContext.Provider>
        )

        expect(screen.getByText("Application types")).toBeInTheDocument()
        expect(screen.getByText("Online applications")).toBeInTheDocument()
        expect(screen.getByText("Common digital application")).toBeInTheDocument()
        expect(screen.getByText("Paper applications")).toBeInTheDocument()
        expect(screen.getByText("Custom online application URL")).toBeInTheDocument()
        expect(screen.getByText("Test reference")).toBeInTheDocument()
        expect(screen.getByText("Referral")).toBeInTheDocument()
        expect(screen.getAllByText("No")).toHaveLength(4)
        expect(screen.queryByText("Referral contact phone")).not.toBeInTheDocument()
        expect(screen.queryByText("Referral summary")).not.toBeInTheDocument()
        expect(screen.queryByText("File name")).not.toBeInTheDocument()
        expect(screen.queryByText("Language")).not.toBeInTheDocument()
      })

      it("should display section data - for referral application", () => {
        render(
          <ListingContext.Provider
            value={{
              ...listing,
              applicationMethods: [
                {
                  id: "method_id",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  type: ApplicationMethodsTypeEnum.Referral,
                  externalReference: "Test Referral Summary",
                  phoneNumber: "(509) 786-4500",
                },
              ],
              digitalApplication: false,
              paperApplication: false,
              referralOpportunity: false,
            }}
          >
            <DetailApplicationTypes />
          </ListingContext.Provider>
        )

        expect(screen.getByText("Application types")).toBeInTheDocument()
        expect(screen.getByText("Online applications")).toBeInTheDocument()
        expect(screen.getByText("Paper applications")).toBeInTheDocument()
        expect(screen.getByText("Referral")).toBeInTheDocument()
        expect(screen.getAllByText("No")).toHaveLength(3)
        expect(screen.getByText("Referral contact phone")).toBeInTheDocument()
        expect(screen.getByText("(509) 786-4500")).toBeInTheDocument()
        expect(screen.getByText("Referral summary")).toBeInTheDocument()
        expect(screen.getByText("Test Referral Summary")).toBeInTheDocument()
        expect(screen.queryByText("Common digital application")).not.toBeInTheDocument()
        expect(screen.queryByText("Custom online application URL")).not.toBeInTheDocument()
        expect(screen.queryByText("Test Reference")).not.toBeInTheDocument()
        expect(screen.queryByText("File name")).not.toBeInTheDocument()
        expect(screen.queryByText("Language")).not.toBeInTheDocument()
      })

      it("should display section data - for paper application", () => {
        render(
          <ListingContext.Provider
            value={{
              ...listing,
              applicationMethods: [
                {
                  id: "method_id",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  type: ApplicationMethodsTypeEnum.FileDownload,
                  externalReference: "Test Refferal Summary",
                  phoneNumber: "(509) 786-4500",
                  paperApplications: [
                    {
                      id: "application_id_1",
                      createdAt: new Date(),
                      updatedAt: new Date(),
                      language: LanguagesEnum.en,
                      assets: {
                        id: "asset_id",
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        fileId: "asset_1_file_id",
                        label: "Asset 1",
                      },
                    },
                    {
                      id: "application_id_2",
                      createdAt: new Date(),
                      updatedAt: new Date(),
                      language: LanguagesEnum.es,
                      assets: {
                        id: "asset_id",
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        fileId: "asset_2_file_id",
                        label: "Asset 2",
                      },
                    },
                  ],
                },
              ],
              digitalApplication: false,
              paperApplication: false,
              referralOpportunity: false,
            }}
          >
            <DetailApplicationTypes />
          </ListingContext.Provider>
        )

        expect(screen.getByText("Application types")).toBeInTheDocument()
        expect(screen.getByText("Online applications")).toBeInTheDocument()
        expect(screen.getAllByText("Paper applications")).toHaveLength(2)
        expect(screen.getByText("Referral")).toBeInTheDocument()
        expect(screen.getAllByText("No")).toHaveLength(3)
        expect(screen.getByText("File name")).toBeInTheDocument()
        expect(screen.getByText("Language")).toBeInTheDocument()
        expect(screen.getByText("English")).toBeInTheDocument()
        expect(screen.getByText("Español")).toBeInTheDocument()
        expect(screen.getAllByText(/asset_\d_file_id.pdf/)).toHaveLength(2)

        expect(screen.queryByText("Referral contact phone")).not.toBeInTheDocument()
        expect(screen.queryByText("Referral summary")).not.toBeInTheDocument()
        expect(screen.queryByText("Common digital application")).not.toBeInTheDocument()
        expect(screen.queryByText("Custom online application URL")).not.toBeInTheDocument()
        expect(screen.queryByText("Test Reference")).not.toBeInTheDocument()
      })

      it("should hide digital application choice when disable flag is on", () => {
        render(
          <AuthContext.Provider
            value={{
              profile: { ...user, jurisdictions: [], listings: [] },
              doJurisdictionsHaveFeatureFlagOn: (featureFlag: FeatureFlagEnum) =>
                featureFlag !== FeatureFlagEnum.enableReferralQuestionUnits,
            }}
          >
            <ListingContext.Provider
              value={{
                ...listing,
                applicationMethods: [
                  {
                    id: "method_id",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    type: ApplicationMethodsTypeEnum.ExternalLink,
                    externalReference: "https://example.com/application",
                  },
                ],
                digitalApplication: false,
                paperApplication: false,
                referralOpportunity: false,
              }}
            >
              <DetailApplicationTypes />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )

        expect(screen.getByText("Application types")).toBeInTheDocument()
        expect(screen.getByText("Online applications")).toBeInTheDocument()
        expect(screen.getByText("Paper applications")).toBeInTheDocument()
        expect(screen.getByText("Custom online application URL")).toBeInTheDocument()
        expect(screen.getByText("https://example.com/application")).toBeInTheDocument()
        expect(screen.getByText("Referral")).toBeInTheDocument()
        expect(screen.getAllByText("No")).toHaveLength(3)
        expect(screen.queryByText("Common digital application")).not.toBeInTheDocument()
        expect(screen.queryByText("Referral contact phone")).not.toBeInTheDocument()
        expect(screen.queryByText("Referral summary")).not.toBeInTheDocument()
        expect(screen.queryByText("File name")).not.toBeInTheDocument()
        expect(screen.queryByText("Language")).not.toBeInTheDocument()
      })
    })

    describe("should display Application Address section", () => {
      it("should display section with mising data", () => {
        render(
          <ListingContext.Provider
            value={{
              ...listing,
              listingsApplicationMailingAddress: undefined,
              applicationMailingAddressType: undefined,
              listingsApplicationPickUpAddress: undefined,
              applicationPickUpAddressType: undefined,
              applicationPickUpAddressOfficeHours: undefined,
              listingsApplicationDropOffAddress: undefined,
              applicationDropOffAddressType: undefined,
              applicationDropOffAddressOfficeHours: undefined,
              postmarkedApplicationsReceivedByDate: undefined,
              additionalApplicationSubmissionNotes: undefined,
            }}
          >
            <DetailApplicationAddress />
          </ListingContext.Provider>
        )

        expect(screen.getByText("Application address")).toBeInTheDocument()
        expect(screen.getByText("Can applications be mailed in?")).toBeInTheDocument()
        expect(screen.getByText("Can applications be picked up?")).toBeInTheDocument()
        expect(screen.getByText("Can applications be dropped off?")).toBeInTheDocument()
        expect(screen.getByText("Are postmarks considered?")).toBeInTheDocument()
        expect(screen.getByText("Additional application submission notes")).toBeInTheDocument()
        expect(screen.getAllByText("No")).toHaveLength(4)
        expect(screen.getAllByText("None")).toHaveLength(1)

        expect(screen.queryByText("Where can applications be mailed in?")).not.toBeInTheDocument()
        expect(screen.queryByText("Leasing agent address")).not.toBeInTheDocument()
        expect(screen.queryByText("Mailing address")).not.toBeInTheDocument()
        expect(screen.queryByText("Where are applications picked up?")).not.toBeInTheDocument()
        expect(screen.queryByText("Pickup address")).not.toBeInTheDocument()
        expect(screen.queryByText("Office hours")).not.toBeInTheDocument()
        expect(screen.queryByText("Where are applications dropped off?")).not.toBeInTheDocument()
        expect(screen.queryByText("Drop off address")).not.toBeInTheDocument()
        expect(screen.queryByText("Received by date")).not.toBeInTheDocument()
        expect(screen.queryByText("Received by time")).not.toBeInTheDocument()
      })

      it("should display all the Application Address data", () => {
        render(
          <ListingContext.Provider
            value={{
              ...listing,
              listingsApplicationMailingAddress: {
                id: "mailing_adress_id",
                createdAt: new Date(),
                updatedAt: new Date(),
                city: "Warrensville Heights",
                state: "Ohio",
                street: "1598 Peaceful Lane",
                zipCode: "44128",
              },
              applicationMailingAddressType: ApplicationAddressTypeEnum.leasingAgent,
              listingsApplicationPickUpAddress: {
                id: "mailing_adress_id",
                createdAt: new Date(),
                updatedAt: new Date(),
                city: "Doral",
                state: "Florida",
                street: "2560 Barnes Street",
                street2: "#13",
                zipCode: "33166",
              },
              applicationPickUpAddressType: ApplicationAddressTypeEnum.leasingAgent,
              listingsApplicationDropOffAddress: {
                id: "mailing_adress_id",
                createdAt: new Date(),
                updatedAt: new Date(),
                city: "Zurich",
                state: "Montana",
                street: "3897 Benson Street",
                street2: "#29",
                zipCode: "59547",
              },
              applicationPickUpAddressOfficeHours: "9AM - 5PM",
              applicationDropOffAddressType: ApplicationAddressTypeEnum.leasingAgent,
              applicationDropOffAddressOfficeHours: "8AM - 4PM",
              postmarkedApplicationsReceivedByDate: new Date(2025, 2, 14, 8, 15),
              additionalApplicationSubmissionNotes: "Test Submission note",
            }}
          >
            <DetailApplicationAddress />
          </ListingContext.Provider>
        )

        expect(screen.getByText("Application address")).toBeInTheDocument()
        expect(screen.getByText("Can applications be mailed in?")).toBeInTheDocument()
        expect(screen.getByText("Where can applications be mailed in?")).toBeInTheDocument()
        expect(screen.getByText("Mailing address")).toBeInTheDocument()
        expect(screen.getByText("Can applications be picked up?")).toBeInTheDocument()
        expect(screen.getByText("Where are applications picked up?")).toBeInTheDocument()
        expect(screen.getByText("Pickup address")).toBeInTheDocument()
        expect(screen.getByText("Can applications be dropped off?")).toBeInTheDocument()
        expect(screen.getByText("Where are applications dropped off?")).toBeInTheDocument()
        expect(screen.getByText("Drop off address")).toBeInTheDocument()
        expect(screen.getByText("Are postmarks considered?")).toBeInTheDocument()
        expect(screen.getByText("Received by date")).toBeInTheDocument()
        expect(screen.getByText("03/14/2025")).toBeInTheDocument()
        expect(screen.getByText("Received by time")).toBeInTheDocument()
        expect(screen.getByText("08:15 AM")).toBeInTheDocument()
        expect(screen.getByText("Additional application submission notes")).toBeInTheDocument()
        expect(screen.getByText("Test Submission note")).toBeInTheDocument()
        expect(screen.getAllByText("Street address or PO box")).toHaveLength(3)
        expect(screen.getAllByText("Apt or unit #")).toHaveLength(3)
        expect(screen.getAllByText("City")).toHaveLength(3)
        expect(screen.getAllByText("State")).toHaveLength(3)
        expect(screen.getAllByText("Zip code")).toHaveLength(3)
        expect(screen.getAllByText("Office hours")).toHaveLength(2)
        expect(screen.getAllByText("Yes")).toHaveLength(4)
        expect(screen.getAllByText("Leasing agent address")).toHaveLength(3)
        expect(screen.getByText("1598 Peaceful Lane")).toBeInTheDocument()
        expect(screen.getByText("None")).toBeInTheDocument()
        expect(screen.getByText("Warrensville Heights")).toBeInTheDocument()
        expect(screen.getByText("Ohio")).toBeInTheDocument()
        expect(screen.getByText("44128")).toBeInTheDocument()
        expect(screen.getByText("2560 Barnes Street")).toBeInTheDocument()
        expect(screen.getByText("#13")).toBeInTheDocument()
        expect(screen.getByText("Doral")).toBeInTheDocument()
        expect(screen.getByText("Florida")).toBeInTheDocument()
        expect(screen.getByText("33166")).toBeInTheDocument()
        expect(screen.getByText("3897 Benson Street")).toBeInTheDocument()
        expect(screen.getByText("#29")).toBeInTheDocument()
        expect(screen.getByText("Zurich")).toBeInTheDocument()
        expect(screen.getByText("Montana")).toBeInTheDocument()
        expect(screen.getByText("59547")).toBeInTheDocument()
      })
    })

    describe("should display Application Dates section", () => {
      it("should display section with mising data", () => {
        render(
          <AuthContext.Provider
            value={{
              profile: { ...user, jurisdictions: [], listings: [] },
              doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
                featureFlag === FeatureFlagEnum.enableMarketingFlyer,
            }}
          >
            <ListingContext.Provider
              value={{
                ...listing,
                applicationDueDate: undefined,
                listingEvents: [],
              }}
            >
              <DetailApplicationDates />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )

        expect(screen.getByText("Application dates")).toBeInTheDocument()
        expect(screen.getByText("Application due date")).toBeInTheDocument()
        expect(screen.getByText("Application due time")).toBeInTheDocument()
        expect(screen.getAllByText("None")).toHaveLength(2)
        expect(screen.queryByText("Open houses")).not.toBeInTheDocument()
        expect(screen.queryByText("Open house")).not.toBeInTheDocument()
        expect(screen.queryByText("Date")).not.toBeInTheDocument()
        expect(screen.queryByText("Start time")).not.toBeInTheDocument()
        expect(screen.queryByText("End time")).not.toBeInTheDocument()
        expect(screen.queryByText("URL")).not.toBeInTheDocument()
        expect(screen.queryByText("Open house notes")).not.toBeInTheDocument()
        expect(screen.queryByText("Done")).not.toBeInTheDocument()
        expect(screen.queryByText("Marketing flyer")).not.toBeInTheDocument()
        expect(screen.queryByText("Preview")).not.toBeInTheDocument()
        expect(screen.queryByText("File name")).not.toBeInTheDocument()
        expect(screen.queryByText("Accessible marketing flyer")).not.toBeInTheDocument()
      })

      it("should display all the Application Dates data", () => {
        render(
          <AuthContext.Provider
            value={{
              profile: { ...user, jurisdictions: [], listings: [] },
              doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
                featureFlag === FeatureFlagEnum.enableMarketingFlyer,
            }}
          >
            <ListingContext.Provider
              value={{
                ...listing,
                applicationDueDate: new Date(2024, 11, 20, 15, 30),
                listingEvents: [
                  {
                    id: "event_id_1",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    type: ListingEventsTypeEnum.openHouse,
                    startDate: new Date(2024, 1, 18, 10, 30),
                    startTime: new Date(2024, 1, 18, 10, 30),
                    endTime: new Date(2024, 1, 18, 12, 15),
                    url: "http://test.url.com",
                    note: "Test lottery note",
                  },
                ],
                marketingFlyer: "http://test.url.com",
                listingsMarketingFlyerFile: {
                  id: "file_id",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  fileId: "file_id",
                  label: "test_file",
                },
                accessibleMarketingFlyer: "http://test.url.com",
                listingsAccessibleMarketingFlyerFile: {
                  id: "file_id_2",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  fileId: "file_id_2",
                  label: "test_file_2",
                },
              }}
            >
              <DetailApplicationDates />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )

        expect(screen.getByText("Application dates")).toBeInTheDocument()
        expect(screen.getByText("Application due date")).toBeInTheDocument()
        expect(screen.getByText("12/20/2024")).toBeInTheDocument()
        expect(screen.getByText("Application due time")).toBeInTheDocument()
        expect(screen.getByText("03:30 PM")).toBeInTheDocument()
        expect(screen.getByText("Open houses")).toBeInTheDocument()
        expect(screen.getByText("Date")).toBeInTheDocument()
        expect(screen.getByText("02/18/2024")).toBeInTheDocument()
        expect(screen.getByText("Start time")).toBeInTheDocument()
        expect(screen.getByText("10:30 AM")).toBeInTheDocument()
        expect(screen.getByText("End time")).toBeInTheDocument()
        expect(screen.getByText("12:15 PM")).toBeInTheDocument()
        expect(screen.getByText("Link")).toBeInTheDocument()

        const urlButton = screen.getByText("URL", { selector: "a" })
        expect(urlButton).toBeInTheDocument()
        expect(urlButton).toHaveAttribute("href", "http://test.url.com")

        expect(screen.getByText("View")).toBeInTheDocument()
        expect(screen.getByText("Marketing flyer")).toBeInTheDocument()
        expect(screen.getAllByText("Preview")).toHaveLength(2)
        expect(screen.getAllByText("File name")).toHaveLength(2)
        expect(screen.getByText("file_id.pdf")).toBeInTheDocument()
        expect(screen.getByText("Accessible marketing flyer")).toBeInTheDocument()
        expect(screen.getByText("file_id_2.pdf")).toBeInTheDocument()
      })
    })

    describe("should display Verification section", () => {
      it("section should be hiden when jurisdiction flag is not set", () => {
        render(
          <AuthContext.Provider
            value={{
              profile: { ...user, jurisdictions: [], listings: [] },
              doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
                mockJurisdictionsHaveFeatureFlagOn(featureFlag, {
                  enableHomeType: true,
                  enableSection8Question: true,
                  enableUnitGroups: false,
                  enableIsVerified: false,
                }),
            }}
          >
            <ListingContext.Provider
              value={{
                ...listing,
                isVerified: true,
              }}
            >
              <DetailListingVerification />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )

        expect(screen.queryByText("Verification")).not.toBeInTheDocument()
        expect(
          screen.queryByText("I verify that this listing data is valid")
        ).not.toBeInTheDocument()
        expect(screen.queryByText("Yes")).not.toBeInTheDocument()
      })

      it("should render section when jurisdiction flag is set", () => {
        render(
          <AuthContext.Provider
            value={{
              profile: { ...user, jurisdictions: [], listings: [] },
              doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
                mockJurisdictionsHaveFeatureFlagOn(featureFlag),
            }}
          >
            <ListingContext.Provider
              value={{
                ...listing,
                isVerified: true,
              }}
            >
              <DetailListingVerification />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )

        expect(screen.getByText("Verification")).toBeInTheDocument()
        expect(screen.getByText("I verify that this listing data is valid")).toBeInTheDocument()
        expect(screen.getByText("Yes")).toBeInTheDocument()
      })
    })
  })

  describe("should display a proper listing status", () => {
    const AVAILABLE_STATUS_OPTIONS = [
      {
        statusEnum: ListingsStatusEnum.active,
        tagString: "Open",
      },
      {
        statusEnum: ListingsStatusEnum.changesRequested,
        tagString: "Changes requested",
      },
      {
        statusEnum: ListingsStatusEnum.closed,
        tagString: "Closed",
      },
      {
        statusEnum: ListingsStatusEnum.pending,
        tagString: "Draft",
      },
      {
        statusEnum: ListingsStatusEnum.pendingReview,
        tagString: "Pending review",
      },
    ].map((item) =>
      Object.assign(item, {
        toString: function () {
          return this.tagString
        },
      })
    )

    it.each(AVAILABLE_STATUS_OPTIONS)(
      "should display proper string for %s status",
      async (status) => {
        document.cookie = "access-token-available=True"
        server.use(
          rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
            return res(ctx.json(user))
          }),
          rest.get("http://localhost:3100/listings/Uvbk5qurpB2WI9V6WnNdH", (_req, res, ctx) => {
            return res(ctx.json(listing))
          })
        )
        jest.spyOn(console, "error").mockImplementation()

        const result = await getServerSideProps(MOCK_CONTEXT)

        render(
          <AuthContext.Provider
            value={{
              profile: {
                ...user,
                listings: [],
                jurisdictions: [jurisdiction],
              },
              doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
                mockJurisdictionsHaveFeatureFlagOn(featureFlag),
            }}
          >
            <ListingDetail
              listing={{
                ...result.props.listing,
                status: status.statusEnum,
              }}
            />
          </AuthContext.Provider>
        )

        const statusTag = await screen.findByText(status.tagString)
        expect(statusTag).toBeInTheDocument()
      }
    )
  })

  describe("should display working listing form actions buttons", () => {
    it("should setup listign setup button", async () => {
      document.cookie = "access-token-available=True"
      server.use(
        rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
          return res(ctx.json(user))
        }),
        rest.get("http://localhost:3100/listings/Uvbk5qurpB2WI9V6WnNdH", (_req, res, ctx) => {
          return res(ctx.json(listing))
        })
      )
      jest.spyOn(console, "error").mockImplementation()

      const result = await getServerSideProps(MOCK_CONTEXT)

      render(
        <AuthContext.Provider
          value={{
            profile: {
              ...user,
              listings: [],
              jurisdictions: [jurisdiction],
            },
            doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
              mockJurisdictionsHaveFeatureFlagOn(featureFlag),
          }}
        >
          <ListingDetail listing={result.props.listing} />
        </AuthContext.Provider>
      )

      const editButton = screen.getByText("Edit")
      expect(editButton).toBeInTheDocument()
      expect(editButton).toHaveAttribute("href", "/listings/Uvbk5qurpB2WI9V6WnNdH/edit")
    })

    describe("should handle copy button request", () => {
      it("should display copy lisitng dialog", async () => {
        document.cookie = "access-token-available=True"
        server.use(
          rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
            return res(ctx.json(user))
          }),
          rest.get("http://localhost:3100/listings/Uvbk5qurpB2WI9V6WnNdH", (_req, res, ctx) => {
            return res(ctx.json(listing))
          })
        )
        jest.spyOn(console, "error").mockImplementation()

        const result = await getServerSideProps(MOCK_CONTEXT)

        render(
          <AuthContext.Provider
            value={{
              profile: {
                ...user,
                listings: [],
                jurisdictions: [jurisdiction],
              },
              doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
                mockJurisdictionsHaveFeatureFlagOn(featureFlag),
            }}
          >
            <ListingDetail listing={result.props.listing} />
          </AuthContext.Provider>
        )

        const copyButton = screen.getByText("Copy", { selector: "button" })
        expect(copyButton).toBeInTheDocument()

        fireEvent.click(copyButton)

        const copyDialogHeader = screen.getByText("Copy listing", { selector: "h1" })
        expect(copyDialogHeader).toBeInTheDocument()

        const copyDialogForm = copyDialogHeader.parentElement.parentElement
        expect(
          within(copyDialogForm).getByText(
            "You are duplicating a listing to draft status. Please enter a unique name below and indicate whether or not you'd like to include existing unit data."
          )
        ).toBeInTheDocument()
        expect(within(copyDialogForm).getByLabelText("Listing name")).toBeInTheDocument()
        expect(within(copyDialogForm).getByLabelText("Listing name")).toHaveAttribute(
          "value",
          "Archer Studios Copy"
        )
        expect(within(copyDialogForm).getByLabelText("Unit data")).toBeInTheDocument()
        expect(
          within(copyDialogForm).getByText(
            "Unit data will automatically be copied unless this box is unchecked."
          )
        ).toBeInTheDocument()
        expect(within(copyDialogForm).getByText("Cancel")).toBeInTheDocument()
        expect(within(copyDialogForm).getByText("Copy")).toBeInTheDocument()
      })

      it("should close dialog on cancel click", async () => {
        document.cookie = "access-token-available=True"
        server.use(
          rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
            return res(ctx.json(user))
          }),
          rest.get("http://localhost:3100/listings/Uvbk5qurpB2WI9V6WnNdH", (_req, res, ctx) => {
            return res(ctx.json(listing))
          })
        )
        jest.spyOn(console, "error").mockImplementation()

        const result = await getServerSideProps(MOCK_CONTEXT)

        render(
          <AuthContext.Provider
            value={{
              profile: {
                ...user,
                listings: [],
                jurisdictions: [jurisdiction],
              },
              doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
                mockJurisdictionsHaveFeatureFlagOn(featureFlag),
            }}
          >
            <ListingDetail listing={result.props.listing} />
          </AuthContext.Provider>
        )

        const copyButton = screen.getByText("Copy", { selector: "button" })
        expect(copyButton).toBeInTheDocument()

        fireEvent.click(copyButton)

        let copyDialogHeader = screen.getByText("Copy listing", { selector: "h1" })
        expect(copyDialogHeader).toBeInTheDocument()

        const copyDialogForm = copyDialogHeader.parentElement.parentElement
        const cancelDialogButton = within(copyDialogForm).getByText("Cancel", {
          selector: "button",
        })

        expect(cancelDialogButton).toBeInTheDocument()
        fireEvent.click(cancelDialogButton)

        copyDialogHeader = screen.queryByText("Copy listing", { selector: "h1" })
        expect(copyDialogHeader).not.toBeInTheDocument()
      })
    })

    it("should setup listing preview button", async () => {
      document.cookie = "access-token-available=True"
      server.use(
        rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
          return res(ctx.json(user))
        }),
        rest.get("http://localhost:3100/listings/Uvbk5qurpB2WI9V6WnNdH", (_req, res, ctx) => {
          return res(ctx.json(listing))
        })
      )
      jest.spyOn(console, "error").mockImplementation()

      const result = await getServerSideProps(MOCK_CONTEXT)

      render(
        <AuthContext.Provider
          value={{
            profile: {
              ...user,
              listings: [],
              jurisdictions: [{ ...jurisdiction, id: "id" }],
            },
            doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
              mockJurisdictionsHaveFeatureFlagOn(featureFlag),
          }}
        >
          <ListingDetail listing={result.props.listing} />
        </AuthContext.Provider>
      )

      const previewButton = screen.getByText("Preview")
      expect(previewButton).toBeInTheDocument()
      expect(previewButton).toHaveAttribute("href", "/preview/listings/Uvbk5qurpB2WI9V6WnNdH")
    })
  })

  it("should display unit drawer details section", async () => {
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(ctx.json(user))
      }),
      rest.get("http://localhost:3100/listings/Uvbk5qurpB2WI9V6WnNdH", (_req, res, ctx) => {
        return res(ctx.json(listing))
      })
    )
    jest.spyOn(console, "error").mockImplementation()

    const result = await getServerSideProps(MOCK_CONTEXT)

    render(
      <AuthContext.Provider
        value={{
          profile: {
            ...user,
            listings: [],
            jurisdictions: [jurisdiction],
          },
          doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
            mockJurisdictionsHaveFeatureFlagOn(featureFlag),
        }}
      >
        <ListingDetail
          listing={{
            ...result.props.listing,
            units: [
              {
                ...result.props.listing.units[0],
                number: `#1`,
                numBathrooms: 1,
                unitAccessibilityPriorityTypes: {
                  id: `ada_1`,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  name: `Test ADA_1`,
                },
              },
            ],
          }}
        />
      </AuthContext.Provider>
    )

    const unitSectionHeader = screen.getByText("Listing units", { selector: "h2" })
    expect(unitSectionHeader).toBeInTheDocument()
    const unitSection = unitSectionHeader.parentElement
    expect(unitSection).toBeInTheDocument()
    const unitViewButton = within(unitSection).getByText("View", { selector: "button" })
    expect(unitViewButton).toBeInTheDocument()

    fireEvent.click(unitViewButton)

    let unitDrawerHeader = screen.getByText("Unit", { selector: "h1" })
    expect(unitDrawerHeader).toBeInTheDocument()

    const unitDrawer = unitDrawerHeader.parentElement.parentElement

    // Details section
    const detailsSectionHeader = within(unitDrawer).getByText("Details", { selector: "h2" })
    expect(detailsSectionHeader).toBeInTheDocument()
    const detailsSection = detailsSectionHeader.parentElement
    expect(within(detailsSection).getByText("Unit number")).toBeInTheDocument()
    expect(within(detailsSection).getByText("Unit type")).toBeInTheDocument()
    expect(within(detailsSection).getByText("Number of bathrooms")).toBeInTheDocument()
    expect(within(detailsSection).getByText("Unit floor")).toBeInTheDocument()
    expect(within(detailsSection).getByText("Square footage")).toBeInTheDocument()
    expect(within(detailsSection).getByText("Minimum occupancy")).toBeInTheDocument()
    expect(within(detailsSection).getByText("Max occupancy")).toBeInTheDocument()
    expect(within(detailsSection).getByText("#1")).toBeInTheDocument()
    expect(within(detailsSection).getByText("Studio")).toBeInTheDocument()
    expect(within(detailsSection).getByText("285")).toBeInTheDocument()
    expect(within(detailsSection).getAllByText("1")).toHaveLength(2)
    expect(within(detailsSection).getAllByText("2")).toHaveLength(2)

    // Eligibility section
    const eligibilitySectionHeader = within(unitDrawer).getByText("Eligibility", {
      selector: "h2",
    })
    expect(eligibilitySectionHeader).toBeInTheDocument()
    const eligibilitySection = eligibilitySectionHeader.parentElement
    expect(within(eligibilitySection).getByText("AMI chart")).toBeInTheDocument()
    expect(within(eligibilitySection).getByText("n/a")).toBeInTheDocument()
    expect(within(eligibilitySection).getByText("Percentage of AMI")).toBeInTheDocument()
    expect(within(eligibilitySection).getByText("45.0")).toBeInTheDocument()
    expect(within(eligibilitySection).getByText("Minimum monthly income")).toBeInTheDocument()
    expect(within(eligibilitySection).getByText("2208.0")).toBeInTheDocument()
    expect(within(eligibilitySection).getByText("Monthly rent")).toBeInTheDocument()
    expect(within(eligibilitySection).getByText("1104.0")).toBeInTheDocument()

    // Accessibility section
    const accessibilitySectionHeader = within(unitDrawer).getByText("Accessibility", {
      selector: "h2",
    })
    expect(accessibilitySectionHeader).toBeInTheDocument()
    const accessibilitySection = accessibilitySectionHeader.parentElement
    expect(
      within(accessibilitySection).getByText("Accessibility priority type")
    ).toBeInTheDocument()
    expect(within(accessibilitySection).getByText("Test ADA_1")).toBeInTheDocument()

    // Should close on done
    const doneButton = within(unitDrawer).getByText("Done", {
      selector: "button",
    })
    expect(doneButton).toBeInTheDocument()
    fireEvent.click(doneButton)

    unitDrawerHeader = screen.queryByText("Unit", { selector: "h1" })
    expect(unitDrawerHeader).not.toBeInTheDocument()
  })

  it("should display correct nav links on non-lottery", async () => {
    window.URL.createObjectURL = jest.fn()
    document.cookie = "access-token-available=True"
    render(
      <AuthContext.Provider
        value={{
          profile: {
            ...user,
            listings: [],
            jurisdictions: [jurisdiction],
          },
          doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
            mockJurisdictionsHaveFeatureFlagOn(featureFlag),
        }}
      >
        <ListingDetail listing={listing} />
      </AuthContext.Provider>
    )

    const secondaryNavigation = await screen.findByRole("navigation", {
      name: "Secondary navigation",
    })
    expect(secondaryNavigation).toBeInTheDocument()
    expect(within(secondaryNavigation).getByRole("link", { name: "Listing" })).toBeInTheDocument()
    expect(
      within(secondaryNavigation).getByRole("link", { name: "Applications" })
    ).toBeInTheDocument()
    expect(within(secondaryNavigation).queryAllByRole("link", { name: "Lottery" })).toHaveLength(0)
  })

  it("should display correct nav links for lottery", async () => {
    window.URL.createObjectURL = jest.fn()
    document.cookie = "access-token-available=True"
    render(
      <AuthContext.Provider
        value={{
          profile: {
            ...user,
            listings: [],
            jurisdictions: [jurisdiction],
          },
          doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
            mockJurisdictionsHaveFeatureFlagOn(featureFlag),
        }}
      >
        <ListingDetail
          listing={{
            ...listing,
            reviewOrderType: ReviewOrderTypeEnum.waitlistLottery,
            lotteryOptIn: true,
            status: ListingsStatusEnum.closed,
          }}
        />
      </AuthContext.Provider>
    )

    const secondaryNavigation = await screen.findByRole("navigation", {
      name: "Secondary navigation",
    })
    expect(secondaryNavigation).toBeInTheDocument()
    expect(within(secondaryNavigation).getByRole("link", { name: "Listing" })).toBeInTheDocument()
    expect(
      within(secondaryNavigation).getByRole("link", { name: "Applications" })
    ).toBeInTheDocument()
    expect(within(secondaryNavigation).getByRole("link", { name: "Lottery" })).toBeInTheDocument()
  })
})
