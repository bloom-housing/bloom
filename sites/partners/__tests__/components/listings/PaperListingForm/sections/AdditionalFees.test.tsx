import React from "react"
import { setupServer } from "msw/lib/node"
import { FormProviderWrapper, mockNextRouter } from "../../../../testUtils"
import { render, screen } from "@testing-library/react"
import AdditionalFees from "../../../../../src/components/listings/PaperListingForm/sections/AdditionalFees"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { jurisdiction, user } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import {
  EnumListingListingType,
  FeatureFlagEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom"

const server = setupServer()

// Enable API mocking before tests.
beforeAll(() => {
  server.listen()
  mockNextRouter()
})

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers())

// Disable API mocking after the tests are done.
afterAll(() => server.close())

describe("AdditionalFees", () => {
  it("should render the base AdditionalFees", async () => {
    render(
      <AuthContext.Provider
        value={{
          profile: { ...user, listings: [], jurisdictions: [jurisdiction] },
          doJurisdictionsHaveFeatureFlagOn: () => false,
        }}
      >
        <FormProviderWrapper>
          <AdditionalFees
            enableNonRegulatedListings={false}
            enableUtilitiesIncluded={false}
            existingUtilities={{
              water: true,
              gas: true,
              trash: true,
              sewer: true,
            }}
            requiredFields={[]}
          />
        </FormProviderWrapper>
      </AuthContext.Provider>
    )

    expect(
      await screen.findByRole("heading", { level: 2, name: /^additional fees$/i })
    ).toBeInTheDocument()
    expect(
      screen.getByText(/^tell us about any other fees required by the applicant.$/i)
    ).toBeInTheDocument()

    expect(screen.getByRole("textbox", { name: /^application fee$/i })).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: /^deposit helper text$/i })).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: /^costs not included$/i })).toBeInTheDocument()

    expect(screen.queryByRole("group", { name: /^utilities included$/i })).not.toBeInTheDocument()
    expect(screen.queryByRole("checkbox", { name: /^water$/i })).not.toBeInTheDocument()
    expect(screen.queryByRole("checkbox", { name: /^gas$/i })).not.toBeInTheDocument()
    expect(screen.queryByRole("checkbox", { name: /^trash$/i })).not.toBeInTheDocument()
    expect(screen.queryByRole("checkbox", { name: /^sewer$/i })).not.toBeInTheDocument()
    expect(screen.queryByRole("checkbox", { name: /^electricity$/i })).not.toBeInTheDocument()
    expect(screen.queryByRole("checkbox", { name: /^cable$/i })).not.toBeInTheDocument()
    expect(screen.queryByRole("checkbox", { name: /^phone$/i })).not.toBeInTheDocument()
    expect(screen.queryByRole("checkbox", { name: /^internet$/i })).not.toBeInTheDocument()
  })

  it("should render the AdditionalFees section with utilities included", async () => {
    render(
      <AuthContext.Provider
        value={{
          profile: { ...user, listings: [], jurisdictions: [jurisdiction] },
          doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
            featureFlag === FeatureFlagEnum.enableUtilitiesIncluded,
        }}
      >
        <FormProviderWrapper>
          <AdditionalFees
            enableNonRegulatedListings={false}
            enableUtilitiesIncluded={true}
            existingUtilities={{
              water: true,
              gas: true,
              trash: true,
              sewer: true,
            }}
            requiredFields={[]}
          />
        </FormProviderWrapper>
      </AuthContext.Provider>
    )

    expect(
      await screen.findByRole("heading", { level: 2, name: /^additional fees$/i })
    ).toBeInTheDocument()
    expect(
      screen.getByText(/^tell us about any other fees required by the applicant.$/i)
    ).toBeInTheDocument()

    expect(screen.getByRole("textbox", { name: /^application fee$/i })).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: /^deposit helper text$/i })).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: /^costs not included$/i })).toBeInTheDocument()

    expect(screen.getByRole("group", { name: /^utilities included$/i })).toBeInTheDocument()
    const water = screen.getByRole("checkbox", { name: /^water$/i })
    const gas = screen.getByRole("checkbox", { name: /^gas$/i })
    const trash = screen.getByRole("checkbox", { name: /^trash$/i })
    const sewer = screen.getByRole("checkbox", { name: /^sewer$/i })
    const electricity = screen.getByRole("checkbox", { name: /^electricity$/i })
    const cable = screen.getByRole("checkbox", { name: /^cable$/i })
    const phone = screen.getByRole("checkbox", { name: /^phone$/i })
    const internet = screen.getByRole("checkbox", { name: /^internet$/i })
    expect(water).toBeInTheDocument()
    expect(water).toBeChecked()
    expect(gas).toBeInTheDocument()
    expect(gas).toBeChecked()
    expect(trash).toBeInTheDocument()
    expect(trash).toBeChecked()
    expect(sewer).toBeInTheDocument()
    expect(sewer).toBeChecked()
    expect(electricity).toBeInTheDocument()
    expect(electricity).not.toBeChecked()
    expect(cable).toBeInTheDocument()
    expect(cable).not.toBeChecked()
    expect(phone).toBeInTheDocument()
    expect(phone).not.toBeChecked()
    expect(internet).toBeInTheDocument()
    expect(internet).not.toBeChecked()
  })

  it("should render the AdditionalFees section for non regulated fields", async () => {
    render(
      <AuthContext.Provider
        value={{
          profile: { ...user, listings: [], jurisdictions: [jurisdiction] },
          doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
            featureFlag === FeatureFlagEnum.enableNonRegulatedListings,
        }}
      >
        <FormProviderWrapper values={{ listingType: EnumListingListingType.nonRegulated }}>
          <AdditionalFees
            existingUtilities={{}}
            requiredFields={[]}
            enableNonRegulatedListings={true}
            enableUtilitiesIncluded={false}
          />
        </FormProviderWrapper>
      </AuthContext.Provider>
    )

    expect(
      await screen.findByRole("heading", { level: 2, name: /^additional fees$/i })
    ).toBeInTheDocument()
    expect(
      screen.getByText(/^tell us about any other fees required by the applicant.$/i)
    ).toBeInTheDocument()

    expect(screen.getByRole("group", { name: /^deposit type$/i })).toBeInTheDocument()
    const fixedDepositOption = screen.getByRole("radio", { name: /^fixed deposit$/i })
    const depositRangeOption = screen.getByRole("radio", { name: /^deposit range$/i })
    expect(fixedDepositOption).toBeInTheDocument()
    expect(fixedDepositOption).toBeChecked()
    expect(depositRangeOption).toBeInTheDocument()
    expect(depositRangeOption).not.toBeChecked()

    expect(screen.getByRole("spinbutton", { name: /^deposit$/i })).toBeInTheDocument()
    expect(screen.queryByRole("spinbutton", { name: /^deposit min$/i })).not.toBeInTheDocument()
    expect(screen.queryByRole("spinbutton", { name: /^deposit max$/i })).not.toBeInTheDocument()

    await userEvent.click(depositRangeOption)

    expect(fixedDepositOption).not.toBeChecked()
    expect(depositRangeOption).toBeChecked()

    expect(screen.getByRole("spinbutton", { name: /^deposit min$/i })).toBeInTheDocument()
    expect(screen.getByRole("spinbutton", { name: /^deposit max$/i })).toBeInTheDocument()
    expect(screen.queryByRole("spinbutton", { name: /^deposit$/i })).not.toBeInTheDocument()
  })
})
