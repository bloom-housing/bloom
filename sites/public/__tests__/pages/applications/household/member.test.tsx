import React from "react"
import { setupServer } from "msw/lib/node"
import { fireEvent, render as rtlRender } from "@testing-library/react"
import { mockNextRouter, render } from "../../../testUtils"
import ApplicationMember from "../../../../src/pages/applications/household/member"
import {
  AuthProvider,
  ConfigProvider,
  blankApplication,
  MessageProvider,
} from "@bloom-housing/shared-helpers"
import {
  HouseholdMemberRelationship,
  Listing,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import {
  AppSubmissionContext,
  retrieveApplicationConfig,
} from "../../../../src/lib/applications/AppSubmissionContext"
import ApplicationConductor from "../../../../src/lib/applications/ApplicationConductor"

window.scrollTo = jest.fn()

const server = setupServer()

beforeAll(() => {
  server.listen()
  mockNextRouter()
})

afterEach(() => server.resetHandlers())

afterAll(() => server.close())

const renderWithCustomRelationships = (relationships: HouseholdMemberRelationship[]) => {
  const conductor = new ApplicationConductor({}, {})
  const applicationConfig = retrieveApplicationConfig(conductor.listing, [])
  conductor.config = {
    ...applicationConfig,
    languages: [],
    featureFlags: [],
    isAdvocate: false,
    visibleHouseholdMemberRelationships: relationships,
  }

  return rtlRender(
    <AppSubmissionContext.Provider
      value={{
        conductor: conductor,
        application: JSON.parse(JSON.stringify(blankApplication)),
        listing: {} as Listing,
        syncApplication: () => {
          return
        },
        syncListing: () => {
          return
        },
      }}
    >
      <ConfigProvider apiUrl={"http://localhost:3100"}>
        <AuthProvider>
          <MessageProvider>
            <ApplicationMember />
          </MessageProvider>
        </AuthProvider>
      </ConfigProvider>
    </AppSubmissionContext.Provider>
  )
}

describe("applications pages", () => {
  afterAll(() => {
    jest.clearAllMocks()
  })

  describe("member step", () => {
    it("should render form fields", () => {
      const { getByText, getByTestId, getAllByTestId } = render(<ApplicationMember />)

      expect(getByText("Tell us about this person")).toBeInTheDocument()
      expect(getByTestId("app-household-member-first-name")).toBeInTheDocument()
      expect(getByTestId("app-household-member-first-name")).toBeInTheDocument()
      expect(getByTestId("app-household-member-first-name")).toBeInTheDocument()
      expect(getByTestId("dob-field-month")).toBeInTheDocument()
      expect(getByTestId("dob-field-day")).toBeInTheDocument()
      expect(getByTestId("dob-field-year")).toBeInTheDocument()
      expect(getAllByTestId("app-household-member-same-address")).toHaveLength(2)
      expect(getAllByTestId("app-household-member-work-in-region")).toHaveLength(2)
      expect(getByTestId("app-household-member-relationship")).toBeInTheDocument()
    })

    it("should require form input", async () => {
      const { getByText, findByText, getAllByText } = render(<ApplicationMember />)

      fireEvent.click(getByText("Save household member"))
      expect(
        await findByText("There are errors you'll need to resolve before moving on.")
      ).toBeInTheDocument()
      expect(getByText("Please enter a given name")).toBeInTheDocument()
      expect(getByText("Please enter a family name")).toBeInTheDocument()
      expect(getByText("Please enter a valid date of birth")).toBeInTheDocument()
      expect(getAllByText("Please select one of the options above.")).toHaveLength(3)
    })

    it("should show more address fields if same address is not selected", () => {
      const { getAllByText, getByTestId } = render(<ApplicationMember />)

      fireEvent.click(getAllByText("No")[0])
      expect(getByTestId("app-household-member-address-street")).toBeInTheDocument()
      expect(getByTestId("app-household-member-address-street2")).toBeInTheDocument()
      expect(getByTestId("app-household-member-address-city")).toBeInTheDocument()
      expect(getByTestId("app-household-member-address-state")).toBeInTheDocument()
      expect(getByTestId("app-household-member-address-zip")).toBeInTheDocument()
    })

    it("should show more address fields if work in region is selected", () => {
      const { getAllByText, getByTestId } = render(<ApplicationMember />)

      fireEvent.click(getAllByText("Yes")[1])
      expect(getByTestId("app-household-member-work-address-street")).toBeInTheDocument()
      expect(getByTestId("app-household-member-work-address-street2")).toBeInTheDocument()
      expect(getByTestId("app-household-member-work-address-city")).toBeInTheDocument()
      expect(getByTestId("app-household-member-work-address-state")).toBeInTheDocument()
      expect(getByTestId("app-household-member-work-address-zip")).toBeInTheDocument()
    })

    it("should show all relationship options when no jurisdiction config is set", () => {
      const { getByTestId } = render(<ApplicationMember />)

      const select = getByTestId("app-household-member-relationship")
      const options = select.querySelectorAll("option")
      const optionValues = Array.from(options)
        .map((opt) => opt.getAttribute("value"))
        .filter((v) => v !== "")

      expect(optionValues).toHaveLength(Object.values(HouseholdMemberRelationship).length)
      expect(optionValues).toContain("spouse")
      expect(optionValues).toContain("registeredDomesticPartner")
      expect(optionValues).toContain("parent")
      expect(optionValues).toContain("child")
      expect(optionValues).toContain("sibling")
      expect(optionValues).toContain("cousin")
      expect(optionValues).toContain("aunt")
      expect(optionValues).toContain("uncle")
      expect(optionValues).toContain("nephew")
      expect(optionValues).toContain("niece")
      expect(optionValues).toContain("grandparent")
      expect(optionValues).toContain("greatGrandparent")
      expect(optionValues).toContain("inLaw")
      expect(optionValues).toContain("friend")
      expect(optionValues).toContain("other")
      expect(optionValues).toContain("aideOrAttendant")
      expect(optionValues).toContain("spousePartner")
      expect(optionValues).toContain("girlfriendBoyfriend")
      expect(optionValues).toContain("brotherSister")
      expect(optionValues).toContain("auntUncle")
      expect(optionValues).toContain("nephewNiece")
      expect(optionValues).toContain("grandparentGreatGrandparent")
      expect(optionValues).toContain("liveInAide")
    })

    it("should show only configured relationship options when jurisdiction config is set", () => {
      const customRelationships = [
        HouseholdMemberRelationship.spousePartner,
        HouseholdMemberRelationship.child,
        HouseholdMemberRelationship.parent,
        HouseholdMemberRelationship.liveInAide,
        HouseholdMemberRelationship.other,
      ]

      const { getByTestId } = renderWithCustomRelationships(customRelationships)

      const select = getByTestId("app-household-member-relationship")
      const options = select.querySelectorAll("option")
      const optionValues = Array.from(options)
        .map((opt) => opt.getAttribute("value"))
        .filter((v) => v !== "")

      expect(optionValues).toHaveLength(5)
      expect(optionValues).toContain("spousePartner")
      expect(optionValues).toContain("child")
      expect(optionValues).toContain("parent")
      expect(optionValues).toContain("liveInAide")
      expect(optionValues).toContain("other")

      expect(optionValues).not.toContain("spouse")
      expect(optionValues).not.toContain("sibling")
      expect(optionValues).not.toContain("aideOrAttendant")
    })
  })
})
