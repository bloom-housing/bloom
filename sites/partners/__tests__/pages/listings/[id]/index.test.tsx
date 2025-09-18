/* eslint-disable import/no-named-as-default */
import React from "react"
import { setupServer } from "msw/lib/node"
import { fireEvent, mockNextRouter, render, within } from "../../../testUtils"
import { ListingContext } from "../../../../src/components/listings/ListingContext"
import { jurisdiction, listing, user } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import DetailListingData from "../../../../src/components/listings/PaperListingDetails/sections/DetailListingData"
import DetailListingIntro from "../../../../src/components/listings/PaperListingDetails/sections/DetailListingIntro"
import DetailBuildingDetails from "../../../../src/components/listings/PaperListingDetails/sections/DetailBuildingDetails"
import DetailCommunityType from "../../../../src/components/listings/PaperListingDetails/sections/DetailCommunityType"
import DetailUnits from "../../../../src/components/listings/PaperListingDetails/sections/DetailUnits"
import DetailPreferences from "../../../../src/components/listings/PaperListingDetails/sections/DetailPreferences"
import {
  ApplicationAddressTypeEnum,
  ApplicationMethodsTypeEnum,
  FeatureFlagEnum,
  LanguagesEnum,
  ListingEventsTypeEnum,
  ListingsStatusEnum,
  MultiselectQuestionsApplicationSectionEnum,
  MultiselectQuestionsStatusEnum,
  RegionEnum,
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
  enableHomeType = true,
  enableSection8Question = true,
  enableUnitGroups = false,
  enableIsVerified = true
) {
  switch (featureFlag) {
    case FeatureFlagEnum.enableHomeType:
      return enableHomeType
    case FeatureFlagEnum.enableSection8Question:
      return enableSection8Question
    case FeatureFlagEnum.enableUnitGroups:
      return enableUnitGroups
    case FeatureFlagEnum.enableIsVerified:
      return enableIsVerified
    default:
      return true
  }
}

describe("listing data", () => {
  describe("should display all listing data", () => {
    it("should display Listing Data section", () => {
      const { getByText } = render(
        <ListingContext.Provider
          value={{
            ...listing,
            createdAt: new Date("February 3, 2025, 10:13"),
          }}
        >
          <DetailListingData />
        </ListingContext.Provider>
      )

      expect(getByText("Listing data")).toBeInTheDocument()
      expect(getByText("Listing ID")).toBeInTheDocument()
      expect(getByText("Uvbk5qurpB2WI9V6WnNdH")).toBeInTheDocument()
      expect(getByText("Date created")).toBeInTheDocument()
      expect(getByText("02/03/2025 at 10:13 AM")).toBeInTheDocument()
    })

    describe("should display Listing Notes section", () => {
      const STATUS_OPTIONS = (Object.values(ListingsStatusEnum) as string[]).filter(
        (item) => item !== ListingsStatusEnum.changesRequested
      )

      it.each(STATUS_OPTIONS)("should hide section for %s status", (status) => {
        const { queryByText } = render(
          <ListingContext.Provider
            value={{
              ...listing,
              status: status as ListingsStatusEnum,
            }}
          >
            <DetailListingNotes />
          </ListingContext.Provider>
        )

        expect(queryByText("Listing notes")).not.toBeInTheDocument()
        expect(queryByText("Change request summary")).not.toBeInTheDocument()
        expect(queryByText("Test changes")).not.toBeInTheDocument()
        expect(queryByText("Request date")).not.toBeInTheDocument()
        expect(queryByText("01/10/2025")).not.toBeInTheDocument()
        expect(queryByText("Requested by")).not.toBeInTheDocument()
        expect(queryByText("John Test")).not.toBeInTheDocument()
      })

      it("should show Listing Notes section data - no user defined", () => {
        const { getByText, queryByText } = render(
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

        expect(getByText("Listing notes")).toBeInTheDocument()
        expect(getByText("Change request summary")).toBeInTheDocument()
        expect(getByText("Test changes")).toBeInTheDocument()
        expect(getByText("Request date")).toBeInTheDocument()
        expect(getByText("01/10/2025")).toBeInTheDocument()
        expect(queryByText("Requested by")).not.toBeInTheDocument()
        expect(queryByText("John Test")).not.toBeInTheDocument()
      })

      it("should show Listing Notes section data - with user defined", () => {
        const { getByText } = render(
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

        expect(getByText("Listing notes")).toBeInTheDocument()
        expect(getByText("Change request summary")).toBeInTheDocument()
        expect(getByText("Test changes")).toBeInTheDocument()
        expect(getByText("Request date")).toBeInTheDocument()
        expect(getByText("01/10/2025")).toBeInTheDocument()
        expect(getByText("Requested by")).toBeInTheDocument()
        expect(getByText("John Test")).toBeInTheDocument()
      })
    })

    it("should display Listing Intro section", () => {
      const { getByText } = render(
        <ListingContext.Provider value={listing}>
          <DetailListingIntro />
        </ListingContext.Provider>
      )

      expect(getByText("Listing intro")).toBeInTheDocument()
      expect(getByText("Listing name")).toBeInTheDocument()
      expect(getByText("Archer Studios")).toBeInTheDocument()
      expect(getByText("Jurisdiction")).toBeInTheDocument()
      expect(getByText("San Jose")).toBeInTheDocument()
      expect(getByText("Housing developer")).toBeInTheDocument()
      expect(getByText("Charities Housing")).toBeInTheDocument()
    })

    describe("should display Lisiting Photo section", () => {
      it("should display section with missing data", () => {
        const { getByText, queryByText, queryByRole } = render(
          <ListingContext.Provider
            value={{
              ...listing,
              listingImages: [],
            }}
          >
            <DetailListingPhotos />
          </ListingContext.Provider>
        )

        expect(getByText("Listing photo")).toBeInTheDocument()
        expect(getByText("None")).toBeInTheDocument()
        expect(queryByText("Preview")).not.toBeInTheDocument()
        expect(queryByText("Primary")).not.toBeInTheDocument()
        expect(queryByText("Primary photo")).not.toBeInTheDocument()
        expect(queryByRole("img")).not.toBeInTheDocument()
      })

      it("should display Lisiting Photo section data", () => {
        const { getByText, getAllByRole } = render(
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

        expect(getByText("Listing photo", { selector: "h2" })).toBeInTheDocument()
        expect(getByText("Preview")).toBeInTheDocument()
        expect(getByText("Primary")).toBeInTheDocument()
        expect(getByText("Primary photo")).toBeInTheDocument()
        const listingImages = getAllByRole("img")
        expect(listingImages).toHaveLength(2)
        listingImages.forEach((imageElement) => {
          expect(imageElement).toHaveAttribute(
            "src",
            "https://res.cloudinary.com/exygy/image/upload/w_400,c_limit,q_65/asset_file_id.jpg"
          )
          expect(imageElement).toHaveAttribute("alt", "Listing photo")
        })
      })
    })

    it("should display Building Details section - without region", () => {
      const { getByText, queryByText } = render(
        <ListingContext.Provider value={{ ...listing, region: RegionEnum.Southwest }}>
          <DetailBuildingDetails />
        </ListingContext.Provider>
      )

      expect(getByText("Building details")).toBeInTheDocument()
      expect(getByText("Building address")).toBeInTheDocument()
      expect(getByText("Street address")).toBeInTheDocument()
      expect(getByText("98 Archer Street")).toBeInTheDocument()
      expect(getByText("City")).toBeInTheDocument()
      expect(getByText("Solano")).toBeInTheDocument()
      expect(getByText("Longitude")).toBeInTheDocument()
      expect(getByText("-121.91071")).toBeInTheDocument()
      expect(getByText("State")).toBeInTheDocument()
      expect(getByText("CA")).toBeInTheDocument()
      expect(getByText("Latitude")).toBeInTheDocument()
      expect(getByText("37.36537")).toBeInTheDocument()
      expect(getByText("Zip code")).toBeInTheDocument()
      expect(getByText("95112")).toBeInTheDocument()
      expect(getByText("Neighborhood")).toBeInTheDocument()
      expect(getByText("Rosemary Gardens Park")).toBeInTheDocument()
      expect(getByText("Year built")).toBeInTheDocument()
      expect(getByText("2012")).toBeInTheDocument()
      expect(queryByText("Region")).not.toBeInTheDocument()
      expect(queryByText("Southwest")).not.toBeInTheDocument()
    })

    it("should display Building Details section - with region", () => {
      const { getByText } = render(
        <AuthContext.Provider
          value={{
            profile: { ...user, jurisdictions: [], listings: [] },
            doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
              mockJurisdictionsHaveFeatureFlagOn(featureFlag),
          }}
        >
          <ListingContext.Provider value={{ ...listing, region: RegionEnum.Southwest }}>
            <DetailBuildingDetails />
          </ListingContext.Provider>
        </AuthContext.Provider>
      )

      expect(getByText("Building details")).toBeInTheDocument()
      expect(getByText("Building address")).toBeInTheDocument()
      expect(getByText("Street address")).toBeInTheDocument()
      expect(getByText("98 Archer Street")).toBeInTheDocument()
      expect(getByText("City")).toBeInTheDocument()
      expect(getByText("San Jose")).toBeInTheDocument()
      expect(getByText("Longitude")).toBeInTheDocument()
      expect(getByText("-121.91071")).toBeInTheDocument()
      expect(getByText("State")).toBeInTheDocument()
      expect(getByText("CA")).toBeInTheDocument()
      expect(getByText("Latitude")).toBeInTheDocument()
      expect(getByText("37.36537")).toBeInTheDocument()
      expect(getByText("Zip code")).toBeInTheDocument()
      expect(getByText("95112")).toBeInTheDocument()
      expect(getByText("Neighborhood")).toBeInTheDocument()
      expect(getByText("Rosemary Gardens Park")).toBeInTheDocument()
      expect(getByText("Year built")).toBeInTheDocument()
      expect(getByText("2012")).toBeInTheDocument()
      expect(getByText("Region")).toBeInTheDocument()
      expect(getByText("Southwest")).toBeInTheDocument()
    })

    describe("should display Community Type section", () => {
      it("should display all section data - without disclaimer", () => {
        const { getByText } = render(
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

        expect(getByText("Community type")).toBeInTheDocument()
        expect(getByText("Reserved community type")).toBeInTheDocument()
        expect(getByText("Farmworker housing")).toBeInTheDocument()
        expect(getByText("Reserved community description")).toBeInTheDocument()
        expect(getByText("Test community description")).toBeInTheDocument()
        expect(
          getByText(
            "Do you want to include a community type disclaimer as the first page of the application?"
          )
        ).toBeInTheDocument()
        expect(getByText("No")).toBeInTheDocument()
      })

      it("should display all section data - with disclaimer", () => {
        const { getByText } = render(
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

        expect(getByText("Community type")).toBeInTheDocument()
        expect(getByText("Reserved community type")).toBeInTheDocument()
        expect(getByText("Farmworker housing")).toBeInTheDocument()
        expect(getByText("Reserved community description")).toBeInTheDocument()
        expect(getByText("Test community description")).toBeInTheDocument()
        expect(
          getByText(
            "Do you want to include a community type disclaimer as the first page of the application?"
          )
        ).toBeInTheDocument()
        expect(getByText("Yes")).toBeInTheDocument()
        expect(getByText("Test Disclaimer Title")).toBeInTheDocument()
        expect(getByText("Test Disclaimer Description")).toBeInTheDocument()
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
        const { getByText } = render(
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

        expect(getByText(typeString))
      })
    })

    it("should display missing Listing Units section", () => {
      const { getByText, queryByText } = render(
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

      expect(getByText("Do you want to show unit types or individual units?")).toBeInTheDocument()
      expect(getByText("Individual units")).toBeInTheDocument()
      expect(getByText("What is the listing availability?")).toBeInTheDocument()
      expect(getByText("Available units")).toBeInTheDocument()
      expect(getByText("None")).toBeInTheDocument()

      expect(queryByText("Unit #")).not.toBeInTheDocument()
      expect(queryByText("Unit type")).not.toBeInTheDocument()
      expect(queryByText("AMI")).not.toBeInTheDocument()
      expect(queryByText("Rent")).not.toBeInTheDocument()
      expect(queryByText("SQ FT")).not.toBeInTheDocument()
      expect(queryByText("ADA")).not.toBeInTheDocument()
      expect(
        queryByText("Do you accept Section 8 Housing Choice Vouchers?")
      ).not.toBeInTheDocument()
      expect(queryByText("No")).not.toBeInTheDocument()
    })

    it("should display Listing Units section", () => {
      const { getByText, getAllByText } = render(
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

      expect(getByText("Do you want to show unit types or individual units?")).toBeInTheDocument()
      expect(getByText("Individual units")).toBeInTheDocument()
      expect(getByText("What is the listing availability?")).toBeInTheDocument()
      expect(getByText("Available units")).toBeInTheDocument()

      expect(getByText("Unit #")).toBeInTheDocument()
      expect(getByText("Unit type")).toBeInTheDocument()
      expect(getByText("AMI")).toBeInTheDocument()
      expect(getByText("Rent")).toBeInTheDocument()
      expect(getByText("SQ FT")).toBeInTheDocument()
      expect(getByText("ADA")).toBeInTheDocument()

      expect(getAllByText(/#[1-9]/i)).toHaveLength(6)
      expect(getAllByText("Studio")).toHaveLength(6)
      expect(getAllByText("45.0")).toHaveLength(6)
      expect(getAllByText("1104.0")).toHaveLength(6)
      expect(getAllByText("285")).toHaveLength(6)
      expect(getAllByText(/Test ADA_\d{1}/)).toHaveLength(6)
      expect(getAllByText("View")).toHaveLength(6)

      expect(getByText("Do you accept Section 8 Housing Choice Vouchers?")).toBeInTheDocument()
      expect(getByText("Yes")).toBeInTheDocument()
    })

    it("should display missing Housing Preferences section", () => {
      const { getByText, queryByText } = render(
        <ListingContext.Provider value={{ ...listing, listingMultiselectQuestions: [] }}>
          <DetailPreferences />
        </ListingContext.Provider>
      )

      expect(getByText("Housing preferences")).toBeInTheDocument()
      expect(getByText("Active preferences")).toBeInTheDocument()
      expect(getByText("None")).toBeInTheDocument()
      expect(queryByText("Order")).not.toBeInTheDocument()
      expect(queryByText("Name")).not.toBeInTheDocument()
      expect(queryByText("Description")).not.toBeInTheDocument()
    })

    it("should display Housing Preferences section", () => {
      const { getByText, getAllByText } = render(
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
                  status: MultiselectQuestionsStatusEnum.draft,
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
                  status: MultiselectQuestionsStatusEnum.draft,
                },
              },
            ],
          }}
        >
          <DetailPreferences />
        </ListingContext.Provider>
      )

      expect(getByText("Housing preferences")).toBeInTheDocument()
      expect(getByText("Active preferences")).toBeInTheDocument()
      expect(getByText("Order")).toBeInTheDocument()
      expect(getByText("1")).toBeInTheDocument()
      expect(getByText("2")).toBeInTheDocument()
      expect(getByText("Name")).toBeInTheDocument()
      expect(getAllByText(/Test Name_\d{1}/)).toHaveLength(2)
      expect(getByText("Description")).toBeInTheDocument()
      expect(getAllByText(/Test Description_\d{1}/)).toHaveLength(2)
    })

    it("should display Housing Programs section", () => {
      const { getByText, getAllByText } = render(
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

      expect(getByText("Housing programs")).toBeInTheDocument()
      expect(getByText("Active programs")).toBeInTheDocument()
      expect(getByText("Order")).toBeInTheDocument()
      expect(getByText("1")).toBeInTheDocument()
      expect(getByText("2")).toBeInTheDocument()
      expect(getByText("Name")).toBeInTheDocument()
      expect(getAllByText(/Test Program Name_\d{1}/)).toHaveLength(2)
      expect(getByText("Description")).toBeInTheDocument()
      expect(getAllByText(/Test Program Description_\d{1}/)).toHaveLength(2)
    })

    it("should display Additional Fees section", () => {
      const { getByText } = render(
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

      expect(getByText("Additional fees")).toBeInTheDocument()
      expect(getByText("Application fee")).toBeInTheDocument()
      expect(getByText("30.0")).toBeInTheDocument()
      expect(getByText("Deposit max")).toBeInTheDocument()
      expect(getByText("1000")).toBeInTheDocument()
      expect(getByText("Deposit helper text")).toBeInTheDocument()
      expect(getByText("Test Deposit Helper Text")).toBeInTheDocument()
      expect(getByText("Deposit min")).toBeInTheDocument()
      expect(getByText("1140.0")).toBeInTheDocument()
      expect(getByText("Costs not included")).toBeInTheDocument()
      expect(
        getByText(
          "Resident responsible for PG&E, internet and phone. Owner pays for water, trash, and sewage."
        )
      ).toBeInTheDocument()
    })

    describe("should display Building Features section", () => {
      it("should display data with no accessibility features", () => {
        const { getByText } = render(
          <ListingContext.Provider
            value={{
              ...listing,
              servicesOffered: "Professional Help",
            }}
          >
            <DetailBuildingFeatures />
          </ListingContext.Provider>
        )

        expect(getByText("Building features")).toBeInTheDocument()
        expect(getByText("Property amenities")).toBeInTheDocument()
        expect(
          getByText(
            "Community Room, Laundry Room, Assigned Parking, Bike Storage, Roof Top Garden, Part-time Resident Service Coordinator"
          )
        ).toBeInTheDocument()
        expect(getByText("Unit amenities")).toBeInTheDocument()
        expect(getByText("Dishwasher")).toBeInTheDocument()
        expect(getByText("Additional accessibility")).toBeInTheDocument()
        expect(
          getByText(
            "There is a total of 5 ADA units in the complex, all others are adaptable. Exterior Wheelchair ramp (front entry)"
          )
        ).toBeInTheDocument()
        expect(getByText("Smoking policy")).toBeInTheDocument()
        expect(getByText("Non-smoking building")).toBeInTheDocument()
        expect(getByText("Pets policy")).toBeInTheDocument()
        expect(
          getByText(
            "No pets allowed. Accommodation animals may be granted to persons with disabilities via a reasonable accommodation request."
          )
        ).toBeInTheDocument()
        expect(getByText("Services offered")).toBeInTheDocument()
        expect(getByText("Professional Help")).toBeInTheDocument()
      })

      it("should display accessibility features", () => {
        document.cookie = "access-token-available=True"
        server.use(
          rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
            return res(ctx.json(user))
          })
        )

        const { getByText } = render(
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
                },
              }}
            >
              <DetailBuildingFeatures />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )

        expect(getByText("Elevator")).toBeInTheDocument()
        expect(getByText("Wheelchair ramp")).toBeInTheDocument()
        expect(getByText("Service animals allowed")).toBeInTheDocument()
        expect(getByText("Accessible parking spots")).toBeInTheDocument()
        expect(getByText("Parking on site")).toBeInTheDocument()
        expect(getByText("In-unit washer/dryer")).toBeInTheDocument()
        expect(getByText("Laundry in building")).toBeInTheDocument()
        expect(getByText("Barrier-free (no-step) property entrance")).toBeInTheDocument()
        expect(getByText("Roll-in showers")).toBeInTheDocument()
        expect(getByText("Grab bars in bathrooms")).toBeInTheDocument()
        expect(getByText("Heating in unit")).toBeInTheDocument()
        expect(getByText("AC in unit")).toBeInTheDocument()
        expect(getByText("Units for those with hearing disabilities")).toBeInTheDocument()
        expect(getByText("Units for those with visual disabilities")).toBeInTheDocument()
        expect(getByText("Units for those with mobility disabilities")).toBeInTheDocument()
        expect(getByText("Lowered cabinets and countertops")).toBeInTheDocument()
        expect(getByText("Lowered light switches")).toBeInTheDocument()
        expect(getByText("Wide unit doorways for wheelchairs")).toBeInTheDocument()
        expect(getByText("Barrier-free bathrooms")).toBeInTheDocument()
        expect(getByText("Barrier-free (no-step) unit entrances"))
      })
    })

    describe("should display Additional Eligibility Rules section", () => {
      it("should display data with selection criteria", () => {
        const { getByText, queryByText } = render(
          <ListingContext.Provider
            value={{
              ...listing,
            }}
          >
            <DetailAdditionalEligibility />
          </ListingContext.Provider>
        )

        expect(getByText("Additional eligibility rules")).toBeInTheDocument()
        expect(getByText("Credit history")).toBeInTheDocument()
        expect(
          // Look only for part of the text to verify that content rendered properly
          getByText(
            /Applications will be rated on a score system for housing. An applicant's score may be impacted by negative tenant peformance information provided to the credit reporting agency./
          )
        ).toBeInTheDocument()
        expect(getByText("Rental history")).toBeInTheDocument()
        expect(
          // Look only for part of the text to verify that content rendered properly
          getByText(/Two years of rental history will be verified with all applicable landlords./)
        ).toBeInTheDocument()
        expect(getByText("Criminal background")).toBeInTheDocument()
        expect(
          // Look only for part of the text to verify that content rendered properly
          getByText(/A criminal background investigation will be obtained on each applicant./)
        ).toBeInTheDocument()
        expect(getByText("Rental assistance")).toBeInTheDocument()
        expect(getByText("Custom rental assistance")).toBeInTheDocument()
        expect(getByText("Building selection criteria")).toBeInTheDocument()
        expect(getByText("URL")).toBeInTheDocument()
        expect(
          getByText("Tenant Selection Criteria will be available to all applicants upon request.")
        ).toBeInTheDocument()
        expect(queryByText("Preview")).not.toBeInTheDocument()
        expect(queryByText("File name")).not.toBeInTheDocument()
      })

      it("should display selection criteria file", async () => {
        const { getByText, findByRole } = render(
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

        expect(getByText("Preview")).toBeInTheDocument()
        expect(getByText("File name")).toBeInTheDocument()
        expect(getByText("example_file.pdf")).toBeInTheDocument()
        expect(getByText("Preview")).toBeInTheDocument()

        const previewImage = await findByRole("img")
        expect(previewImage).toBeInTheDocument()
        expect(previewImage).toHaveAttribute("src", "example_file")
        expect(previewImage).toHaveAttribute("alt", "PDF preview")
      })
    })

    it("should display Additional Details section", () => {
      const { getByText } = render(
        <ListingContext.Provider
          value={{
            ...listing,
          }}
        >
          <DetailAdditionalDetails />
        </ListingContext.Provider>
      )

      expect(getByText("Required documents")).toBeInTheDocument()
      expect(getByText("Completed application and government issued IDs")).toBeInTheDocument()
      expect(getByText("Important program rules")).toBeInTheDocument()
      expect(
        getByText(
          "Applicants must adhere to minimum & maximum income limits. Tenant Selection Criteria applies."
        )
      ).toBeInTheDocument()
      expect(getByText("Special notes")).toBeInTheDocument()
      expect(getByText("Special notes description")).toBeInTheDocument()
    })

    describe("should display Rankings & Results section", () => {
      it("should display data for waitlist review order typy without lottery event", () => {
        const { getByText, queryByText } = render(
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

        expect(getByText("Rankings & results")).toBeInTheDocument()
        expect(getByText("Do you want to show a waitlist size?")).toBeInTheDocument()
        expect(getByText("Yes")).toBeInTheDocument()
        expect(getByText("Number of openings")).toBeInTheDocument()
        expect(getByText("Tell the applicant what to expect from the process")).toBeInTheDocument()
        expect(
          getByText(
            "Applicant will be contacted. All info will be verified. Be prepared if chosen."
          )
        ).toBeInTheDocument()

        expect(
          queryByText("How is the application review order determined?")
        ).not.toBeInTheDocument()
        expect(queryByText("Lottery")).not.toBeInTheDocument()
        expect(queryByText("First come first serve")).not.toBeInTheDocument()
        expect(
          queryByText("Will the lottery be run in the partner portal?")
        ).not.toBeInTheDocument()
        expect(queryByText("When will the lottery be run?")).not.toBeInTheDocument()
        expect(queryByText("Lottery start time")).not.toBeInTheDocument()
        expect(queryByText("Lottery end time")).not.toBeInTheDocument()
        expect(queryByText("Lottery date notes")).not.toBeInTheDocument()
      })

      it("should display data for first come first serve review order typy without lottery event", () => {
        const { getByText, queryByText } = render(
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

        expect(getByText("Rankings & results")).toBeInTheDocument()
        expect(getByText("How is the application review order determined?")).toBeInTheDocument()
        expect(getByText("First come first serve")).toBeInTheDocument()
        expect(getByText("Tell the applicant what to expect from the process")).toBeInTheDocument()
        expect(
          getByText(
            "Applicant will be contacted. All info will be verified. Be prepared if chosen."
          )
        ).toBeInTheDocument()

        expect(queryByText("Do you want to show a waitlist size?")).not.toBeInTheDocument()
        expect(queryByText("Yes")).not.toBeInTheDocument()
        expect(queryByText("Number of Openings")).not.toBeInTheDocument()
        expect(queryByText("Lottery")).not.toBeInTheDocument()
        expect(
          queryByText("Will the lottery be run in the partner portal?")
        ).not.toBeInTheDocument()
        expect(queryByText("When will the lottery be run?")).not.toBeInTheDocument()
        expect(queryByText("Lottery start time")).not.toBeInTheDocument()
        expect(queryByText("Lottery end time")).not.toBeInTheDocument()
        expect(queryByText("Lottery date notes")).not.toBeInTheDocument()
      })

      it("should display data for lottery serve review order typy with lottery event", () => {
        process.env.showLottery = "true"
        const { getByText, queryByText } = render(
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

        expect(getByText("Rankings & results")).toBeInTheDocument()
        expect(getByText("How is the application review order determined?")).toBeInTheDocument()
        expect(getByText("Lottery")).toBeInTheDocument()
        expect(getByText("Will the lottery be run in the partner portal?")).toBeInTheDocument()
        expect(getByText("No")).toBeInTheDocument()
        expect(getByText("When will the lottery be run?")).toBeInTheDocument()
        expect(getByText("02/18/2024")).toBeInTheDocument()
        expect(getByText("Lottery start time")).toBeInTheDocument()
        expect(getByText("10:30 AM")).toBeInTheDocument()
        expect(getByText("Lottery end time")).toBeInTheDocument()
        expect(getByText("12:15 PM")).toBeInTheDocument()
        expect(getByText("Lottery date notes")).toBeInTheDocument()
        expect(getByText("Test lottery note")).toBeInTheDocument()
        expect(getByText("Tell the applicant what to expect from the process")).toBeInTheDocument()
        expect(
          getByText(
            "Applicant will be contacted. All info will be verified. Be prepared if chosen."
          )
        ).toBeInTheDocument()

        expect(queryByText("Do you want to show a waitlist size?")).not.toBeInTheDocument()
        expect(queryByText("Yes")).not.toBeInTheDocument()
        expect(queryByText("Number of openings")).not.toBeInTheDocument()
        expect(queryByText("First come first serve")).not.toBeInTheDocument()
      })
    })

    it("should display Leasing Agent section", () => {
      const { getByText } = render(
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

      expect(getByText("Leasing agent")).toBeInTheDocument()
      expect(getByText("Leasing agent name")).toBeInTheDocument()
      expect(getByText("Marisela Baca")).toBeInTheDocument()
      expect(getByText("Email")).toBeInTheDocument()
      expect(getByText("mbaca@charitieshousing.org")).toBeInTheDocument()
      expect(getByText("Phone")).toBeInTheDocument()
      expect(getByText("(408) 217-8562")).toBeInTheDocument()
      expect(getByText("Leasing agent title")).toBeInTheDocument()
      expect(getByText("Pro Agent")).toBeInTheDocument()
      expect(getByText("Office hours")).toBeInTheDocument()
      expect(getByText("Monday, Tuesday & Friday, 9:00AM - 5:00PM")).toBeInTheDocument()
      expect(getByText("Leasing agent address")).toBeInTheDocument()
      expect(getByText("Street address or PO box")).toBeInTheDocument()
      expect(getByText("98 Archer Street")).toBeInTheDocument()
      expect(getByText("Apt or unit #")).toBeInTheDocument()
      expect(getByText("#12")).toBeInTheDocument()
      expect(getByText("City")).toBeInTheDocument()
      expect(getByText("San Jose")).toBeInTheDocument()
      expect(getByText("State")).toBeInTheDocument()
      expect(getByText("CA")).toBeInTheDocument()
      expect(getByText("Zip code")).toBeInTheDocument()
      expect(getByText("95112")).toBeInTheDocument()
    })

    describe("should display Application Types section", () => {
      it("should display section with missing data", () => {
        const { getByText, getAllByText, queryByText } = render(
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

        expect(getByText("Application types")).toBeInTheDocument()
        expect(getByText("Online applications")).toBeInTheDocument()
        expect(getByText("Paper applications")).toBeInTheDocument()
        // Disabled for Doorway
        // expect(getByText("Referral")).toBeInTheDocument()
        expect(getAllByText("n/a")).toHaveLength(2)
        expect(queryByText("Common digital application")).not.toBeInTheDocument()
        // expect(queryByText("Referral contact phone")).not.toBeInTheDocument()
        // expect(queryByText("Referral summary")).not.toBeInTheDocument()
        expect(queryByText("Custom online application URL")).not.toBeInTheDocument()
        expect(queryByText("File name")).not.toBeInTheDocument()
        expect(queryByText("Language")).not.toBeInTheDocument()
      })

      it("should display section data - for internal application", () => {
        const { getByText, getAllByText, queryByText } = render(
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

        expect(getByText("Application types")).toBeInTheDocument()
        expect(getByText("Online applications")).toBeInTheDocument()
        expect(getByText("Common digital application")).toBeInTheDocument()
        expect(getByText("Paper applications")).toBeInTheDocument()
        // Disabled for Doorway
        // expect(getByText("Referral")).toBeInTheDocument()
        expect(getAllByText("Yes")).toHaveLength(3)
        // expect(queryByText("Referral contact phone")).not.toBeInTheDocument()
        // expect(queryByText("Referral summary")).not.toBeInTheDocument()
        expect(queryByText("Custom online application URL")).not.toBeInTheDocument()
        expect(queryByText("File name")).not.toBeInTheDocument()
        expect(queryByText("Language")).not.toBeInTheDocument()
      })

      it("should display section data - for external application", () => {
        const { getByText, getAllByText, queryByText } = render(
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

        expect(getByText("Application types")).toBeInTheDocument()
        expect(getByText("Online applications")).toBeInTheDocument()
        expect(getByText("Common digital application")).toBeInTheDocument()
        expect(getByText("Paper applications")).toBeInTheDocument()
        expect(getByText("Custom online application URL")).toBeInTheDocument()
        expect(getByText("Test reference")).toBeInTheDocument()
        // Disabled for Doorway
        // expect(getByText("Referral")).toBeInTheDocument()
        expect(getAllByText("No")).toHaveLength(3)
        // expect(queryByText("Referral contact phone")).not.toBeInTheDocument()
        // expect(queryByText("Referral summary")).not.toBeInTheDocument()
        expect(queryByText("File name")).not.toBeInTheDocument()
        expect(queryByText("Language")).not.toBeInTheDocument()
      })

      it("should display section data - for referral application", () => {
        const { getByText, getAllByText, queryByText } = render(
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

        expect(getByText("Application types")).toBeInTheDocument()
        expect(getByText("Online applications")).toBeInTheDocument()
        expect(getByText("Paper applications")).toBeInTheDocument()
        // Disabled for Doorway
        // expect(getByText("Referral")).toBeInTheDocument()
        expect(getAllByText("No")).toHaveLength(2)
        // expect(getByText("Referral contact phone")).toBeInTheDocument()
        // expect(getByText("(509) 786-4500")).toBeInTheDocument()
        // expect(getByText("Referral summary")).toBeInTheDocument()
        // expect(getByText("Test Referral Summary")).toBeInTheDocument()
        expect(queryByText("Common digital application")).not.toBeInTheDocument()
        expect(queryByText("Custom online application URL")).not.toBeInTheDocument()
        expect(queryByText("Test Reference")).not.toBeInTheDocument()
        expect(queryByText("File name")).not.toBeInTheDocument()
        expect(queryByText("Language")).not.toBeInTheDocument()
      })

      it("should display section data - for paper application", () => {
        const { getByText, getAllByText, queryByText } = render(
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

        expect(getByText("Application types")).toBeInTheDocument()
        expect(getByText("Online applications")).toBeInTheDocument()
        expect(getAllByText("Paper applications")).toHaveLength(2)
        // Disabled for Doorway
        // expect(getByText("Referral")).toBeInTheDocument()
        expect(getAllByText("No")).toHaveLength(2)
        expect(getByText("File name")).toBeInTheDocument()
        expect(getByText("Language")).toBeInTheDocument()
        expect(getByText("English")).toBeInTheDocument()
        expect(getByText("Español")).toBeInTheDocument()
        expect(getAllByText(/asset_\d_file_id.pdf/)).toHaveLength(2)

        // expect(queryByText("Referral contact phone")).not.toBeInTheDocument()
        // expect(queryByText("Referral summary")).not.toBeInTheDocument()
        expect(queryByText("Common digital application")).not.toBeInTheDocument()
        expect(queryByText("Custom online application URL")).not.toBeInTheDocument()
        expect(queryByText("Test Reference")).not.toBeInTheDocument()
      })

      it("should hide digital application choice when disable flag is on", () => {
        const { getByText, getAllByText, queryByText } = render(
          <AuthContext.Provider
            value={{
              profile: { ...user, jurisdictions: [], listings: [] },
              doJurisdictionsHaveFeatureFlagOn: () => true,
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

        expect(getByText("Application types")).toBeInTheDocument()
        expect(getByText("Online applications")).toBeInTheDocument()
        expect(getByText("Paper applications")).toBeInTheDocument()
        expect(getByText("Custom online application URL")).toBeInTheDocument()
        expect(getByText("https://example.com/application")).toBeInTheDocument()
        // Disabled for Doorway
        // expect(getByText("Referral")).toBeInTheDocument()
        expect(getAllByText("No")).toHaveLength(2)
        expect(queryByText("Common digital application")).not.toBeInTheDocument()
        // expect(queryByText("Referral contact phone")).not.toBeInTheDocument()
        // expect(queryByText("Referral summary")).not.toBeInTheDocument()
        expect(queryByText("File name")).not.toBeInTheDocument()
        expect(queryByText("Language")).not.toBeInTheDocument()
      })
    })

    describe("should display Application Address section", () => {
      it("should display section with mising data", () => {
        const { getByText, getAllByText, queryByText } = render(
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

        expect(getByText("Application address")).toBeInTheDocument()
        expect(getByText("Can applications be mailed in?")).toBeInTheDocument()
        expect(getByText("Can applications be picked up?")).toBeInTheDocument()
        expect(getByText("Can applications be dropped off?")).toBeInTheDocument()
        expect(getByText("Are postmarks considered?")).toBeInTheDocument()
        expect(getByText("Additional application submission notes")).toBeInTheDocument()
        expect(getAllByText("No")).toHaveLength(4)
        expect(getAllByText("None")).toHaveLength(1)

        expect(queryByText("Where can applications be mailed in?")).not.toBeInTheDocument()
        expect(queryByText("Leasing agent address")).not.toBeInTheDocument()
        expect(queryByText("Mailing address")).not.toBeInTheDocument()
        expect(queryByText("Where are applications picked up?")).not.toBeInTheDocument()
        expect(queryByText("Pickup address")).not.toBeInTheDocument()
        expect(queryByText("Office hours")).not.toBeInTheDocument()
        expect(queryByText("Where are applications dropped off?")).not.toBeInTheDocument()
        expect(queryByText("Drop off address")).not.toBeInTheDocument()
        expect(queryByText("Received by date")).not.toBeInTheDocument()
        expect(queryByText("Received by time")).not.toBeInTheDocument()
      })

      it("should display all the Application Address data", () => {
        const { getByText, getAllByText } = render(
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

        expect(getByText("Application address")).toBeInTheDocument()
        expect(getByText("Can applications be mailed in?")).toBeInTheDocument()
        expect(getByText("Where can applications be mailed in?")).toBeInTheDocument()
        expect(getByText("Mailing address")).toBeInTheDocument()
        expect(getByText("Can applications be picked up?")).toBeInTheDocument()
        expect(getByText("Where are applications picked up?")).toBeInTheDocument()
        expect(getByText("Pickup address")).toBeInTheDocument()
        expect(getByText("Can applications be dropped off?")).toBeInTheDocument()
        expect(getByText("Where are applications dropped off?")).toBeInTheDocument()
        expect(getByText("Drop off address")).toBeInTheDocument()
        expect(getByText("Are postmarks considered?")).toBeInTheDocument()
        expect(getByText("Received by date")).toBeInTheDocument()
        expect(getByText("03/14/2025")).toBeInTheDocument()
        expect(getByText("Received by time")).toBeInTheDocument()
        expect(getByText("08:15 AM")).toBeInTheDocument()
        expect(getByText("Additional application submission notes")).toBeInTheDocument()
        expect(getByText("Test Submission note")).toBeInTheDocument()
        expect(getAllByText("Street address or PO box")).toHaveLength(3)
        expect(getAllByText("Apt or unit #")).toHaveLength(3)
        expect(getAllByText("City")).toHaveLength(3)
        expect(getAllByText("State")).toHaveLength(3)
        expect(getAllByText("Zip code")).toHaveLength(3)
        expect(getAllByText("Office hours")).toHaveLength(2)
        expect(getAllByText("Yes")).toHaveLength(4)
        expect(getAllByText("Leasing agent address")).toHaveLength(3)
        expect(getByText("1598 Peaceful Lane")).toBeInTheDocument()
        expect(getByText("None")).toBeInTheDocument()
        expect(getByText("Warrensville Heights")).toBeInTheDocument()
        expect(getByText("Ohio")).toBeInTheDocument()
        expect(getByText("44128")).toBeInTheDocument()
        expect(getByText("2560 Barnes Street")).toBeInTheDocument()
        expect(getByText("#13")).toBeInTheDocument()
        expect(getByText("Doral")).toBeInTheDocument()
        expect(getByText("Florida")).toBeInTheDocument()
        expect(getByText("33166")).toBeInTheDocument()
        expect(getByText("3897 Benson Street")).toBeInTheDocument()
        expect(getByText("#29")).toBeInTheDocument()
        expect(getByText("Zurich")).toBeInTheDocument()
        expect(getByText("Montana")).toBeInTheDocument()
        expect(getByText("59547")).toBeInTheDocument()
      })
    })

    describe("should display Application Dates section", () => {
      it("should display section with mising data", () => {
        const { getByText, getAllByText, queryByText } = render(
          <ListingContext.Provider
            value={{
              ...listing,
              applicationDueDate: undefined,
              listingEvents: [],
            }}
          >
            <DetailApplicationDates />
          </ListingContext.Provider>
        )

        expect(getByText("Application dates")).toBeInTheDocument()
        expect(getByText("Application due date")).toBeInTheDocument()
        expect(getByText("Application due time")).toBeInTheDocument()
        expect(getAllByText("None")).toHaveLength(2)
        expect(queryByText("Open houses")).not.toBeInTheDocument()
        expect(queryByText("Open house")).not.toBeInTheDocument()
        expect(queryByText("Date")).not.toBeInTheDocument()
        expect(queryByText("Start time")).not.toBeInTheDocument()
        expect(queryByText("End time")).not.toBeInTheDocument()
        expect(queryByText("URL")).not.toBeInTheDocument()
        expect(queryByText("Open house notes")).not.toBeInTheDocument()
        expect(queryByText("Done")).not.toBeInTheDocument()
      })

      it("should display all the Application Dates data", () => {
        const { getByText } = render(
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
            }}
          >
            <DetailApplicationDates />
          </ListingContext.Provider>
        )

        expect(getByText("Application dates")).toBeInTheDocument()
        expect(getByText("Application due date")).toBeInTheDocument()
        expect(getByText("12/20/2024")).toBeInTheDocument()
        expect(getByText("Application due time")).toBeInTheDocument()
        expect(getByText("03:30 PM")).toBeInTheDocument()
        expect(getByText("Open houses")).toBeInTheDocument()
        expect(getByText("Date")).toBeInTheDocument()
        expect(getByText("02/18/2024")).toBeInTheDocument()
        expect(getByText("Start time")).toBeInTheDocument()
        expect(getByText("10:30 AM")).toBeInTheDocument()
        expect(getByText("End time")).toBeInTheDocument()
        expect(getByText("12:15 PM")).toBeInTheDocument()
        expect(getByText("Link")).toBeInTheDocument()

        const urlButton = getByText("URL", { selector: "a" })
        expect(urlButton).toBeInTheDocument()
        expect(urlButton).toHaveAttribute("href", "http://test.url.com")

        expect(getByText("View")).toBeInTheDocument()
      })
    })

    describe("should display Verification section", () => {
      it("section should be hiden when jurisdiction flag is not set", () => {
        const { queryByText } = render(
          <AuthContext.Provider
            value={{
              profile: { ...user, jurisdictions: [], listings: [] },
              doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
                mockJurisdictionsHaveFeatureFlagOn(featureFlag, true, true, false, false),
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

        expect(queryByText("Verification")).not.toBeInTheDocument()
        expect(queryByText("I verify that this listing data is valid")).not.toBeInTheDocument()
        expect(queryByText("Yes")).not.toBeInTheDocument()
      })

      it("should render section when jurisdiction flag is set", () => {
        const { getByText } = render(
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

        expect(getByText("Verification")).toBeInTheDocument()
        expect(getByText("I verify that this listing data is valid")).toBeInTheDocument()
        expect(getByText("Yes")).toBeInTheDocument()
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

        const { findByText } = render(
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

        const statusTag = await findByText(status.tagString)
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

      const { getByText } = render(
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

      const editButton = getByText("Edit")
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

        const { getByText } = render(
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

        const copyButton = getByText("Copy", { selector: "button" })
        expect(copyButton).toBeInTheDocument()

        fireEvent.click(copyButton)

        const copyDialogHeader = getByText("Copy listing", { selector: "h1" })
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

        const { getByText, queryByText } = render(
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

        const copyButton = getByText("Copy", { selector: "button" })
        expect(copyButton).toBeInTheDocument()

        fireEvent.click(copyButton)

        let copyDialogHeader = getByText("Copy listing", { selector: "h1" })
        expect(copyDialogHeader).toBeInTheDocument()

        const copyDialogForm = copyDialogHeader.parentElement.parentElement
        const cancelDialogButton = within(copyDialogForm).getByText("Cancel", {
          selector: "button",
        })

        expect(cancelDialogButton).toBeInTheDocument()
        fireEvent.click(cancelDialogButton)

        copyDialogHeader = queryByText("Copy listing", { selector: "h1" })
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

      const { getByText } = render(
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

      const previewButton = getByText("Preview")
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

    const { getByText, queryByText } = render(
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

    const unitSectionHeader = getByText("Listing units", { selector: "h2" })
    expect(unitSectionHeader).toBeInTheDocument()
    const unitSection = unitSectionHeader.parentElement
    expect(unitSection).toBeInTheDocument()
    const unitViewButton = within(unitSection).getByText("View", { selector: "button" })
    expect(unitViewButton).toBeInTheDocument()

    fireEvent.click(unitViewButton)

    let unitDrawerHeader = getByText("Unit", { selector: "h1" })
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
    const eligibilitySectionHeader = within(unitDrawer).getByText("Eligibility", { selector: "h2" })
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

    unitDrawerHeader = queryByText("Unit", { selector: "h1" })
    expect(unitDrawerHeader).not.toBeInTheDocument()
  })
})
