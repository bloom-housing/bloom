import React from "react"
import { setupServer } from "msw/lib/node"
import { screen } from "@testing-library/react"
import { mockNextRouter, render } from "../../../testUtils"
import ApplicationAddress from "../../../../src/pages/applications/contact/address"
import ApplicationConductor from "../../../../src/lib/applications/ApplicationConductor"
import { listing } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import {
  AppSubmissionContext,
  retrieveApplicationConfig,
} from "../../../../src/lib/applications/AppSubmissionContext"
import { FeatureFlagEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { blankApplication } from "@bloom-housing/shared-helpers"
import userEvent from "@testing-library/user-event"

window.scrollTo = jest.fn()

const server = setupServer()

beforeAll(() => {
  server.listen()
  mockNextRouter()
})

afterEach(() => server.resetHandlers())

afterAll(() => server.close())

describe("applications pages", () => {
  afterAll(() => {
    jest.clearAllMocks()
  })

  describe("address step", () => {
    it("should render form fields", () => {
      render(<ApplicationAddress />)

      expect(
        screen.getByRole("heading", {
          level: 2,
          name: /now we need to know how to contact you about your application/i,
        })
      ).toBeInTheDocument()

      // Phone Number
      expect(screen.getByRole("group", { name: /your phone number/i })).toBeInTheDocument()
      expect(screen.getByRole("textbox", { name: /^number$/i })).toBeInTheDocument()
      expect(
        screen.getByRole("combobox", { name: /what type of number is this\?/i })
      ).toBeInTheDocument()
      expect(
        screen.getByRole("checkbox", { name: /i don't have a telephone number/i })
      ).toBeInTheDocument()
      expect(
        screen.getByRole("checkbox", { name: /i have an additional phone number/i })
      ).toBeInTheDocument()

      // Adress
      expect(screen.getByRole("group", { name: /your address/i })).toBeInTheDocument()
      expect(
        screen.getByText(
          /we need the address where you currently live. If you are homeless, enter either the shelter address or an address close to where you stay./i
        )
      ).toBeInTheDocument()
      expect(screen.getByRole("textbox", { name: /street address/i })).toBeInTheDocument()
      expect(screen.getByRole("textbox", { name: /apt or unit #/i })).toBeInTheDocument()
      expect(screen.getByRole("textbox", { name: /city name/i })).toBeInTheDocument()
      expect(screen.getByRole("combobox", { name: /state/i })).toBeInTheDocument()
      expect(screen.getByRole("textbox", { name: /zip code/i })).toBeInTheDocument()
      expect(
        screen.getByRole("checkbox", { name: /send my mail to a different address/i })
      ).toBeInTheDocument()

      // expect(
      //   screen.getByRole("group", { name: /how do you prefer to be contacted/i })
      // ).toBeInTheDocument()
      // expect(screen.getByRole("checkbox", { name: /^email$/i })).toBeInTheDocument()
      // expect(screen.getByRole("checkbox", { name: /^phone$/i })).toBeInTheDocument()
      // expect(screen.getByRole("checkbox", { name: /^letter$/i })).toBeInTheDocument()
      // expect(screen.getByRole("checkbox", { name: /^text$/i })).toBeInTheDocument()

      // expect(
      //   screen.getByRole("group", { name: /^do you work in %{county} County?\?$/i })
      // ).toBeInTheDocument()
      // expect(screen.getByText(/tbd/i)).toBeInTheDocument()
      // expect(screen.getByRole("radio", { name: /^yes$/i })).toBeInTheDocument()
      // expect(screen.getByRole("radio", { name: /^no$/i })).toBeInTheDocument()

      // expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument()
    })

    it("should require form input", async () => {
      render(<ApplicationAddress />)

      await userEvent.click(screen.getByRole("button", { name: /next/i }))
      expect(
        await screen.findByText("There are errors you'll need to resolve before moving on.")
      ).toBeInTheDocument()
      expect(screen.getByText(/^please enter a phone number$/i)).toBeInTheDocument()
      expect(screen.getByText(/please enter a phone number type/i)).toBeInTheDocument()
      expect(screen.getByText(/please enter an address/i)).toBeInTheDocument()
      // expect(screen.getByText(/please select at least one option/i)).toBeInTheDocument()
      expect(screen.getByText(/please select one of the options above./i)).toBeInTheDocument()
    })

    it("should disable phone fields if user indicates they don't have a phone", async () => {
      render(<ApplicationAddress />)

      const phoneInput = screen.getByRole("textbox", { name: /^number$/i })
      const phoneSelect = screen.getByRole("combobox", { name: /what type of number is this\?/i })
      expect(phoneInput).toBeInTheDocument()
      expect(phoneSelect).toBeInTheDocument()
      expect(phoneInput).toBeEnabled()
      expect(phoneSelect).toBeEnabled()

      await userEvent.click(
        screen.getByRole("checkbox", { name: /i don't have a telephone number/i })
      )

      expect(phoneInput).toBeDisabled()
      expect(phoneSelect).toBeDisabled()
    })

    it("should hide work in region question when flag enabled", () => {
      const conductor = new ApplicationConductor({}, listing)
      const applicationConfig = retrieveApplicationConfig(conductor.listing)
      conductor.config = {
        ...applicationConfig,
        languages: [],
        featureFlags: [
          {
            createdAt: new Date(),
            updatedAt: new Date(),
            id: "test_id",
            name: FeatureFlagEnum.disableWorkInRegion,
            active: true,
            description: "",
            jurisdictions: [],
          },
        ],
      }

      render(
        <AppSubmissionContext.Provider
          value={{
            conductor: conductor,
            application: JSON.parse(JSON.stringify(blankApplication)),
            listing: listing,
            syncApplication: jest.fn(),
            syncListing: jest.fn(),
          }}
        >
          <ApplicationAddress />
        </AppSubmissionContext.Provider>
      )

      expect(
        screen.getByRole("heading", {
          level: 2,
          name: /now we need to know how to contact you about your application/i,
        })
      ).toBeInTheDocument()

      // Phone Number
      expect(screen.getByRole("group", { name: /your phone number/i })).toBeInTheDocument()
      expect(screen.getByRole("textbox", { name: /^number$/i })).toBeInTheDocument()
      expect(
        screen.getByRole("combobox", { name: /what type of number is this\?/i })
      ).toBeInTheDocument()
      expect(
        screen.getByRole("checkbox", { name: /i don't have a telephone number/i })
      ).toBeInTheDocument()
      expect(
        screen.getByRole("checkbox", { name: /i have an additional phone number/i })
      ).toBeInTheDocument()

      // Adress
      expect(screen.getByRole("group", { name: /your address/i })).toBeInTheDocument()
      expect(
        screen.getByText(
          /we need the address where you currently live. If you are homeless, enter either the shelter address or an address close to where you stay./i
        )
      ).toBeInTheDocument()
      expect(screen.getByRole("textbox", { name: /street address/i })).toBeInTheDocument()
      expect(screen.getByRole("textbox", { name: /apt or unit #/i })).toBeInTheDocument()
      expect(screen.getByRole("textbox", { name: /city name/i })).toBeInTheDocument()
      expect(screen.getByRole("combobox", { name: /state/i })).toBeInTheDocument()
      expect(screen.getByRole("textbox", { name: /zip code/i })).toBeInTheDocument()
      expect(
        screen.getByRole("checkbox", { name: /send my mail to a different address/i })
      ).toBeInTheDocument()

      // expect(
      //   screen.getByRole("group", { name: /how do you prefer to be contacted/i })
      // ).toBeInTheDocument()
      // expect(screen.getByRole("checkbox", { name: /^email$/i })).toBeInTheDocument()
      // expect(screen.getByRole("checkbox", { name: /^phone$/i })).toBeInTheDocument()
      // expect(screen.getByRole("checkbox", { name: /^letter$/i })).toBeInTheDocument()
      // expect(screen.getByRole("checkbox", { name: /^text$/i })).toBeInTheDocument()

      // expect(
      //   screen.queryByRole("group", { name: /^do you work in %{county} County?\?$/i })
      // ).not.toBeInTheDocument()
      // expect(screen.queryByText(/tbd/i)).not.toBeInTheDocument()
      // expect(screen.queryByRole("radio", { name: /^yes$/i })).not.toBeInTheDocument()
      // expect(screen.queryByRole("radio", { name: /^no$/i })).not.toBeInTheDocument()

      // expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument()
    })
  })
})
