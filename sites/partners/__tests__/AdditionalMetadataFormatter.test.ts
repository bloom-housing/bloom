import { Preference, ReservedCommunityType } from "@bloom-housing/backend-core/types"
import { LatitudeLongitude } from "@bloom-housing/ui-components"
import AdditionalMetadataFormatter from "../src/listings/PaperListingForm/formatters/AdditionalMetadataFormatter"
import { FormListing, FormMetadata } from "../src/listings/PaperListingForm/formTypes"

const latLong: LatitudeLongitude = {
  latitude: 37.36537,
  longitude: -121.91071,
}

const formatData = (data, metadata) => {
  return new AdditionalMetadataFormatter({ ...data }, metadata).format().data
}

describe("AdditionalMetadataFormatter", () => {
  it("should format preferences", () => {
    const data = { reservedCommunityType: { id: "12345" } } as FormListing
    const metadata = {
      latLong,
      preferences: [
        {
          title: "Preference 1",
        },
        {
          title: "Preference 2",
        },
      ],
    } as FormMetadata

    expect(formatData(data, metadata).preferences).toEqual([
      { title: "Preference 1", ordinal: 1 },
      { title: "Preference 2", ordinal: 2 },
    ])
  })

  it("should format", () => {})
})
