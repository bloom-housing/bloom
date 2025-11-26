import React from "react"
import { render, cleanup, screen, within } from "@testing-library/react"
import { AdditionalInformation } from "../../../../src/components/listing/listing_sections/AdditionalInformation"
import { getAdditionalInformation } from "../../../../src/components/listing/ListingViewSeedsHelpers"
import { listing } from "@bloom-housing/shared-helpers/__tests__/testHelpers"

afterEach(cleanup)

describe("<AdditionalInformation>", () => {
  it("shows all content", () => {
    render(
      <AdditionalInformation
        additionalInformation={[
          {
            heading: "Additional information 1 heading",
            description: "Description for additional information 1",
          },
          {
            heading: "Additional information 2 heading",
            description: "Description for additional information 2",
          },
        ]}
      />
    )
    expect(screen.getAllByText("Additional information").length).toBeGreaterThan(0)
    expect(screen.getAllByText("Required documents and selection criteria").length).toBeGreaterThan(
      0
    )
    expect(screen.getByText("Additional information 1 heading")).toBeDefined()
    expect(screen.getByText("Description for additional information 1")).toBeDefined()
    expect(screen.getByText("Additional information 2 heading")).toBeDefined()
    expect(screen.getByText("Description for additional information 2")).toBeDefined()
  })
  it("shows nothing if no additional information passed", () => {
    render(<AdditionalInformation additionalInformation={[]} />)
    expect(screen.queryByText("Additional information")).toBeNull()
  })
  it("shows documents full list for non-regualted listings", () => {
    render(
      <AdditionalInformation
        additionalInformation={getAdditionalInformation({
          ...listing,
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
          requiredDocuments: "Test additional documents info",
        })}
      />
    )

    expect(
      screen.getAllByRole("heading", { level: 2, name: /additional information/i }).length
    ).toBeGreaterThan(0)
    expect(
      screen.getAllByText(/required documents and selection criteria/i).length
    ).toBeGreaterThan(0)

    const requiredDocumentsCardTitle = screen.getByRole("heading", {
      level: 3,
      name: /^required documents$/i,
    })
    expect(requiredDocumentsCardTitle).toBeInTheDocument()
    const requiredDocumentsCard = requiredDocumentsCardTitle.parentElement
    expect(within(requiredDocumentsCard).getByText("Social Security card")).toBeInTheDocument()
    expect(
      within(requiredDocumentsCard).getByText("Current landlord reference")
    ).toBeInTheDocument()
    expect(
      within(requiredDocumentsCard).getByText("Birth Certificate (all household members 18+)")
    ).toBeInTheDocument()
    expect(
      within(requiredDocumentsCard).getByText("Previous landlord reference")
    ).toBeInTheDocument()
    expect(
      within(requiredDocumentsCard).getByText("Government-issued ID (all household members 18+)")
    ).toBeInTheDocument()
    expect(
      within(requiredDocumentsCard).getByText("Proof of Assets (bank statements, etc.)")
    ).toBeInTheDocument()
    expect(
      within(requiredDocumentsCard).getByText("Proof of household income (check stubs, W-2, etc.)")
    ).toBeInTheDocument()
    expect(
      within(requiredDocumentsCard).getByText("Immigration/Residency documents (green card, etc.)")
    ).toBeInTheDocument()
    expect(
      within(requiredDocumentsCard).getByText("Proof of Custody/Guardianship")
    ).toBeInTheDocument()

    const additionalDocumentsCardTitle = screen.getByRole("heading", {
      level: 3,
      name: /required documents \(additional info\)/i,
    })
    expect(additionalDocumentsCardTitle).toBeInTheDocument()

    const additionalDocumentsCard = additionalDocumentsCardTitle.parentElement
    expect(
      within(additionalDocumentsCard).getByText("Test additional documents info")
    ).toBeInTheDocument()
  })
  it("shows documents partial list for non-regualted listings", () => {
    render(
      <AdditionalInformation
        additionalInformation={getAdditionalInformation({
          ...listing,
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
        })}
      />
    )

    expect(
      screen.getAllByRole("heading", { level: 2, name: /additional information/i }).length
    ).toBeGreaterThan(0)
    expect(
      screen.getAllByText(/required documents and selection criteria/i).length
    ).toBeGreaterThan(0)

    const requiredDocumentsCardTitle = screen.getByRole("heading", {
      level: 3,
      name: /^required documents$/i,
    })
    expect(requiredDocumentsCardTitle).toBeInTheDocument()
    const requiredDocumentsCard = requiredDocumentsCardTitle.parentElement
    expect(within(requiredDocumentsCard).getByText("Social Security card")).toBeInTheDocument()
    expect(
      within(requiredDocumentsCard).getByText("Current landlord reference")
    ).toBeInTheDocument()
    expect(
      within(requiredDocumentsCard).getByText("Birth Certificate (all household members 18+)")
    ).toBeInTheDocument()
    expect(
      within(requiredDocumentsCard).getByText("Previous landlord reference")
    ).toBeInTheDocument()
    expect(
      within(requiredDocumentsCard).queryByText("Government-issued ID (all household members 18+)")
    ).not.toBeInTheDocument()
    expect(
      within(requiredDocumentsCard).queryByText("Proof of Assets (bank statements, etc.)")
    ).not.toBeInTheDocument()
    expect(
      within(requiredDocumentsCard).queryByText(
        "Proof of household income (check stubs, W-2, etc.)"
      )
    ).not.toBeInTheDocument()
    expect(
      within(requiredDocumentsCard).queryByText(
        "Immigration/Residency documents (green card, etc.)"
      )
    ).not.toBeInTheDocument()
    expect(
      within(requiredDocumentsCard).queryByText("Proof of Custody/Guardianship")
    ).not.toBeInTheDocument()

    expect(
      screen.queryByRole("heading", {
        level: 3,
        name: /required documents \(additional info\)/i,
      })
    ).toBeInTheDocument()
  })
})
