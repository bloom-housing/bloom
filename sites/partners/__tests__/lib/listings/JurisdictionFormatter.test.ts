import JurisdictionFormatter from "../../../src/lib/listings/JurisdictionFormatter"
import { FormListing, FormMetadata } from "../../../src/lib/listings/formTypes"
const metadata = {
  profile: {
    jurisdictions: [{ name: "Alameda" }],
  },
} as FormMetadata

describe("JurisdictionFormatter", () => {
  it("should pull from profile when data is blank", () => {
    const data = {} as FormListing

    const formatter = new JurisdictionFormatter(data, metadata).format()
    expect(formatter.data.jurisdiction).toEqual({ name: "Alameda" })
  })
  it("should use data when present and ignore profile", () => {
    const data = {
      jurisdiction: { name: "San Jose" },
    } as FormListing

    const formatter = new JurisdictionFormatter(data, metadata).format()
    expect(formatter.data.jurisdiction).toEqual({ name: "San Jose" })
  })
})
