import JurisdictionFormatter from "../src/listings/PaperListingForm/formatters/JurisdictionFormatter"
import { FormListing, FormMetadata } from "../src/listings/PaperListingForm/formTypes"

describe("JurisdictionFormatter", () => {
  it("should pull from profile when data is blank", () => {
    const data = {} as FormListing
    const metadata = {
      profile: {
        jurisdictions: [{ name: "Alameda" }],
      },
    } as FormMetadata

    const formatter = new JurisdictionFormatter(data, metadata)
    formatter.format()
    expect(formatter.data.jurisdiction).toEqual({ name: "Alameda" })
  })
  it("should use data when present and ignore profile", () => {
    const data = {
      jurisdiction: { name: "San Jose" },
    } as FormListing
    const metadata = {
      profile: {
        jurisdictions: [{ name: "Alameda" }],
      },
    } as FormMetadata

    const formatter = new JurisdictionFormatter(data, metadata)
    formatter.format()
    expect(formatter.data.jurisdiction).toEqual({ name: "San Jose" })
  })
})
