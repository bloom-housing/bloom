import React from "react"
import { setupServer } from "msw/lib/node"
import { render, screen } from "@testing-library/react"
import { EnumListingListingType } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import AdditionalDetails from "../../../../../src/components/listings/PaperListingForm/sections/AdditionalDetails"
import { FormProviderWrapper, mockNextRouter } from "../../../../testUtils"

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

describe("AdditionalDetails", () => {
  it("should render the AdditionalDetails section with default/regulated fields", async () => {
    render(
      <FormProviderWrapper>
        <AdditionalDetails
          defaultText="This is a mock default text"
          enableNonRegulatedListings={true}
          existingDocuments={{
            socialSecurityCard: true,
            currentLandlordReference: true,
            birthCertificate: true,
            previousLandlordReference: true,
            governmentIssuedId: true,
            proofOfAssets: true,
            proofOfIncome: true,
            residencyDocuments: true,
            proofOfCustody: true,
          }}
          requiredFields={[]}
        />
      </FormProviderWrapper>
    )

    // Check for the section heading
    expect(
      await screen.findByRole("heading", { level: 2, name: /additional details/i })
    ).toBeInTheDocument()
    expect(
      screen.getByText("Are there any other required documents and selection criteria?")
    ).toBeInTheDocument()

    expect(screen.getByRole("textbox", { name: /^required documents$/i })).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: /^important program rules$/i })).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: /^required documents$/i })).toBeInTheDocument()

    expect(
      screen.queryByRole("textbox", { name: /^required documents (additional info)$/i })
    ).not.toBeInTheDocument()
    expect(screen.queryByRole("group", { name: /^required documents$/i })).not.toBeInTheDocument()
  })

  it("should render the AdditionalDetails section with non-regulated fields", async () => {
    render(
      <FormProviderWrapper
        values={{
          listingType: EnumListingListingType.nonRegulated,
        }}
      >
        <AdditionalDetails
          defaultText="This is a mock default text"
          enableNonRegulatedListings={true}
          existingDocuments={{
            socialSecurityCard: true,
            currentLandlordReference: true,
            birthCertificate: true,
            previousLandlordReference: true,
            governmentIssuedId: false,
            proofOfAssets: false,
            proofOfIncome: false,
            residencyDocuments: false,
            proofOfCustody: false,
          }}
          requiredFields={[]}
        />
      </FormProviderWrapper>
    )

    // Check for the section heading
    expect(
      await screen.findByRole("heading", { level: 2, name: /additional details/i })
    ).toBeInTheDocument()
    expect(
      screen.getByText("Are there any other required documents and selection criteria?")
    ).toBeInTheDocument()

    expect(screen.getByRole("group", { name: /^required documents$/i })).toBeInTheDocument()

    const socialSecurityCard = screen.getByRole("checkbox", { name: /^social security card$/i })
    const currentLandlordReference = screen.getByRole("checkbox", {
      name: /^current landlord reference$/i,
    })
    const birthCertificate = screen.getByRole("checkbox", {
      name: /^birth certificate \(all household members 18\+\)$/i,
    })
    const previousLandlordReference = screen.getByRole("checkbox", {
      name: /^previous landlord reference$/i,
    })
    const governmentIssuedId = screen.getByRole("checkbox", {
      name: /^government-issued ID \(all household members 18\+\)$/i,
    })
    const proofOfAssets = screen.getByRole("checkbox", {
      name: /^proof of assets \(bank statements, etc.\)$/i,
    })
    const proofOfIncome = screen.getByRole("checkbox", {
      name: /^proof of household income \(check stubs, W-2, etc.\)$/i,
    })
    const residencyDocuments = screen.getByRole("checkbox", {
      name: /^immigration\/residency documents \(green card, etc.\)$/i,
    })
    const proofOfCustody = screen.getByRole("checkbox", {
      name: /^proof of custody\/guardianship$/i,
    })

    expect(socialSecurityCard).toBeInTheDocument()
    expect(socialSecurityCard).toBeChecked()
    expect(currentLandlordReference).toBeInTheDocument()
    expect(currentLandlordReference).toBeChecked()
    expect(birthCertificate).toBeInTheDocument()
    expect(birthCertificate).toBeChecked()
    expect(previousLandlordReference).toBeInTheDocument()
    expect(previousLandlordReference).toBeChecked()
    expect(governmentIssuedId).toBeInTheDocument()
    expect(governmentIssuedId).not.toBeChecked()
    expect(proofOfAssets).toBeInTheDocument()
    expect(proofOfAssets).not.toBeChecked()
    expect(proofOfIncome).toBeInTheDocument()
    expect(proofOfIncome).not.toBeChecked()
    expect(residencyDocuments).toBeInTheDocument()
    expect(residencyDocuments).not.toBeChecked()
    expect(proofOfCustody).toBeInTheDocument()
    expect(proofOfCustody).not.toBeChecked()

    expect(
      screen.getByRole("textbox", { name: /^required documents \(additional info\)$/i })
    ).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: /^important program rules$/i })).toBeInTheDocument()

    expect(screen.queryByRole("textbox", { name: /^required documents$/i })).not.toBeInTheDocument()
  })
})
